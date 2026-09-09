import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const imageDirectory = path.resolve('public/images');
const squadSource = path.resolve('assets/source/meet-the-squad.png');
const heroSource = path.join(imageDirectory, 'community-1920.webp');
const logoSource = path.join(imageDirectory, 'server-icon.png');

await mkdir(imageDirectory, { recursive: true });

for (const width of [640, 960, 1440, 1672]) {
  await sharp(squadSource)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toFile(path.join(imageDirectory, `meet-the-squad-${width}.webp`));
}

const socialOverlay = Buffer.from(`
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="rgba(10,10,10,0.58)"/>
    <rect x="64" y="64" width="8" height="502" fill="#e8bc62"/>
    <text x="112" y="245" fill="#f4f4ef" font-family="Arial, sans-serif" font-size="122" font-weight="800" letter-spacing="-4">FIGHT CLUB</text>
    <text x="118" y="322" fill="#e8bc62" font-family="Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="4">WARDOGS</text>
    <text x="118" y="394" fill="#f4f4ef" font-family="Arial, sans-serif" font-size="34">Good fights. Good laughs. Find your squad.</text>
    <text x="118" y="498" fill="#c8c8c2" font-family="Arial, sans-serif" font-size="23" letter-spacing="2">NORTH AMERICA  /  ENGLISH SPEAKING  /  PVP</text>
  </svg>
`);

const logo = await sharp(logoSource).resize(150, 150).png().toBuffer();

await sharp(heroSource)
  .resize(1200, 630, { fit: 'cover', position: 'center' })
  .grayscale()
  .modulate({ brightness: 0.72 })
  .composite([{ input: socialOverlay }, { input: logo, left: 970, top: 60 }])
  .webp({ quality: 88, effort: 6 })
  .toFile(path.join(imageDirectory, 'social-preview.webp'));

console.log('Prepared responsive squad images and social preview.');
