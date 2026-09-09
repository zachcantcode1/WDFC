import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';
const runName = new Date()
  .toISOString()
  .replaceAll(':', '-')
  .replaceAll('.', '-');
const evidenceDirectory = path.resolve(
  process.env.VERIFICATION_DIR ?? `.artifacts/verify-wdfc/${runName}`,
);
const expectedText = [
  'BUILT FOR THE',
  'OUR STORY STARTED',
  'FIND YOUR',
  'Find what you need.',
  'Monthly giveaways.',
  'Hanging out earns rewards.',
];
const viewports = [
  { name: 'mobile', width: 390, height: 844, columns: 1 },
  { name: 'tablet', width: 768, height: 1024, columns: 2 },
  { name: 'desktop', width: 1440, height: 1000, columns: 3 },
];

const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);
const chromePath = chromeCandidates.find(existsSync);

assert(
  chromePath,
  'Chrome or Edge was not found. Set CHROME_PATH and try again.',
);

await mkdir(evidenceDirectory, { recursive: true });

const pageResponse = await fetch(siteUrl);
assert.equal(pageResponse.status, 200, `${siteUrl} did not return HTTP 200.`);

for (const asset of [
  '/images/community-640.webp',
  '/images/meet-the-squad-640.webp',
  '/images/meet-the-squad-960.webp',
  '/images/meet-the-squad-1440.webp',
  '/images/meet-the-squad-1672.webp',
  '/images/server-icon.png',
  '/images/social-preview.webp',
]) {
  const response = await fetch(new URL(asset, siteUrl));
  assert.equal(response.status, 200, `${asset} did not return HTTP 200.`);
}

const profileDirectory = await mkdtemp(
  path.join(os.tmpdir(), 'verify-wdfc-chrome-'),
);
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=0',
    `--user-data-dir=${profileDirectory}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

try {
  const devToolsPort = await waitForDevToolsPort(profileDirectory);
  const targetResponse = await fetch(
    `http://127.0.0.1:${devToolsPort}/json/new?${encodeURIComponent(siteUrl)}`,
    { method: 'PUT' },
  );
  const target = await targetResponse.json();
  const cdp = await connectCdp(target.webSocketDebuggerUrl);

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  for (const viewport of viewports) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: siteUrl });
    await waitForPage(cdp);
    await evaluate(
      cdp,
      "document.querySelector('.squad-photo')?.scrollIntoView({ block: 'center' })",
    );
    await waitForImages(cdp);

    const result = await evaluate(
      cdp,
      `(() => {
      const cards = [...document.querySelectorAll('.feature-card')];
      const cardRows = cards.map((card) => Math.round(card.getBoundingClientRect().x));
      const joinLinks = [...document.querySelectorAll('a[href*="discord.gg"]')];
      const squadImage = document.querySelector('.squad-photo img');
      const meta = (selector) => document.querySelector(selector)?.getAttribute('content') ?? '';

      return {
        bodyText: document.body.innerText,
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        columnCount: new Set(cardRows).size,
        imagesReady: [...document.images].every((image) => image.complete && image.naturalWidth > 0),
        joinHrefs: joinLinks.map((link) => link.href),
        squadCurrentSrc: squadImage?.currentSrc ?? '',
        squadNaturalWidth: squadImage?.naturalWidth ?? 0,
        openGraphImage: meta('meta[property="og:image"]'),
        twitterCard: meta('meta[name="twitter:card"]'),
      };
    })()`,
    );

    assert(
      result.scrollWidth <= result.clientWidth + 1,
      `${viewport.name} has horizontal overflow (${result.scrollWidth}px > ${result.clientWidth}px).`,
    );
    assert(
      result.imagesReady,
      `${viewport.name} has an image that failed to load.`,
    );
    assert.equal(
      result.columnCount,
      viewport.columns,
      `${viewport.name} has the wrong feature-card column count.`,
    );
    assert(
      result.joinHrefs.length >= 3 &&
        result.joinHrefs.every((href) =>
          href.startsWith('https://discord.gg/'),
        ),
      `${viewport.name} has a missing or invalid Discord link.`,
    );
    assert(
      result.squadCurrentSrc.includes('/images/meet-the-squad-') &&
        result.squadCurrentSrc.endsWith('.webp'),
      `${viewport.name} did not load a responsive squad WebP.`,
    );
    assert(
      result.squadNaturalWidth > 0,
      `${viewport.name} squad image is empty.`,
    );
    assert(
      result.openGraphImage.includes('/images/social-preview.webp'),
      'Open Graph preview metadata is missing.',
    );
    assert.equal(result.twitterCard, 'summary_large_image');

    for (const text of expectedText) {
      assert(
        result.bodyText.toLowerCase().includes(text.toLowerCase()),
        `${viewport.name} is missing “${text}”.`,
      );
    }

    const screenshot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
    });
    await writeFile(
      path.join(evidenceDirectory, `${viewport.name}-${viewport.width}.png`),
      Buffer.from(screenshot.data, 'base64'),
    );

    console.log(
      `PASS ${viewport.name}: ${viewport.width}px, ${result.columnCount} card column(s), ${path.basename(result.squadCurrentSrc)}`,
    );
  }

  cdp.close();
  console.log(`Evidence: ${evidenceDirectory}`);
} finally {
  if (chrome.exitCode === null) {
    chrome.kill();
    await new Promise((resolve) => chrome.once('exit', resolve));
  }
  await rm(profileDirectory, { recursive: true, force: true });
}

async function waitForDevToolsPort(directory) {
  const file = path.join(directory, 'DevToolsActivePort');

  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const [port] = (await readFile(file, 'utf8')).split(/\r?\n/);
      return Number(port);
    } catch {
      await delay(100);
    }
  }

  throw new Error('Chrome did not expose a debugging port within 10 seconds.');
}

async function connectCdp(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  let messageId = 0;

  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    const request = pending.get(message.id);

    if (!request) return;
    pending.delete(message.id);

    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  });

  return {
    send(method, params = {}) {
      messageId += 1;
      const id = messageId;

      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    close() {
      socket.close();
    },
  };
}

async function waitForPage(cdp) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const ready = await evaluate(cdp, "document.readyState === 'complete'");

    if (ready) {
      await evaluate(cdp, 'document.fonts.ready.then(() => true)');
      await delay(150);
      return;
    }

    await delay(100);
  }

  throw new Error('The page did not finish loading within 10 seconds.');
}

async function waitForImages(cdp) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const ready = await evaluate(
      cdp,
      '[...document.images].every((image) => image.complete && image.naturalWidth > 0)',
    );

    if (ready) return;
    await delay(100);
  }

  throw new Error('One or more images did not load within 10 seconds.');
}

async function evaluate(cdp, expression) {
  const response = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.text);
  }

  return response.result.value;
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
