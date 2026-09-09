# WARDOGS FIGHT CLUB

Single-page independent Discord community landing page. React, TypeScript, Vinext, Tailwind CSS and shadcn/ui (Base UI Button).

## Development

Run `npm install`, then `npm run dev`. `npm run build` creates the
Cloudflare-compatible production bundle.

- `npm run check` runs application type, lint, and formatting checks.
- `npm run images` regenerates responsive squad images and the social preview.
- `npm run verify:site` checks the running site in Chrome at mobile, tablet, and
  desktop widths and saves screenshots under `.artifacts/verify-wdfc/`.

The scaffold's unused component catalog has pre-existing whole-project lint
findings, so the application check targets the maintained source paths.

## Content

Edit `lib/community.ts` for the name, Discord invite, and descriptive copy.
Theme and responsive layout are in `app/globals.css`. The invite supplied for
this private preview expires September 13, 2026; replace it with a permanent
invite before public release.

## Assets

Game artwork belongs to BULKHEAD / Team17. The current fight-poster layout uses
the revival image at its original 1920 × 1080 resolution, with high-quality
640/960/1440/1920px WebP sources for responsive displays. The squad image uses
640/960/1440/1672px WebP sources, and the share card is 1200 × 630. No image is
upscaled. The server icon is used with the community owner's approval. The
earlier helicopter treatment was replaced to distinguish Fight Club from
another community using the same image.

The editable squad PNG is kept at `assets/source/meet-the-squad.png` so it is
not included in the public site bundle.

The official WDFC mark is kept at `assets/source/wdfc-logo.png`. The image
preparation script creates a transparent 512px WebP for the page and a 192px
PNG for browser icons. The previous server icon remains in
`assets/source/legacy-server-icon.png` and is no longer published.

The compact header lockup is kept at `assets/source/wdfc-header-lockup.png` and
is published as a trimmed 512px WebP.

- Hero: https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1867240/13fbc7cb084ec25c20ad031c7e888a9459cd8e77/ss_13fbc7cb084ec25c20ad031c7e888a9459cd8e77.1920x1080.jpg
- Revival: https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1867240/672d7ce9debe7a3bcfa5feee5fccc3d8b482b13e/ss_672d7ce9debe7a3bcfa5feee5fccc3d8b482b13e.1920x1080.jpg
- Logo: https://cdn.discordapp.com/icons/1536551110989447168/15fb93d815bbfb39b18cd43bb6a379b8.png?size=512

## Accessibility and behavior

Semantic page structure, skip link, visible keyboard focus, reduced-motion
support, responsive layouts, descriptive image alternative text, and real
anchor-based Discord buttons. No accounts, bots, counters, analytics, or remote
content embeds.

## Release checks

Run `npm run check`, `npm run build`, and the project-local verification skill at
`.cursor/skills/verify-wdfc/SKILL.md`. Before publishing, replace the temporary
Discord invite and rerun the browser verification. Git history is intentionally
not initialized yet.
