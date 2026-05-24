# HeliosX Performance and Image Audit

Date: 2026-05-23

## Findings

- The largest public assets are video files: `mainpagevideo2.mp4` at about 20.73 MB and `mainpagevideo.mp4` at about 11.34 MB.
- Several PNG/JPG assets are larger than 5 MB, including parallax layers, product portraits, checkout imagery, and hallway imagery.
- SEO-critical pages now use mostly text, SVG diagrams, and Next metadata, so they are lighter than the image-heavy product/home experiences.
- Next Image optimization is now configured to prefer AVIF and WebP where supported, with a 30-day minimum cache TTL.

## Recommended Next Pass

- Convert oversized PNG/JPG hero assets to WebP or AVIF source files.
- Create mobile-sized variants for the largest product and homepage images.
- Compress the two homepage videos and consider poster images plus lazy-loaded video.
- Keep SVG diagrams for measurement and optics education because they are small, crisp, and crawlable through surrounding text.
- Run Lighthouse after deployment on `/`, `/product`, `/product/medusa`, `/surgical-loupes`, and `/measurements`.

## Current Largest Assets

- `public/mainpagevideo2.mp4` - 20.73 MB
- `public/mainpagevideo.mp4` - 11.34 MB
- `public/basex4.png` - 7.28 MB
- `public/basex1.png` - 7.27 MB
- `public/basex3.png` - 7.26 MB
- `public/basex.png` - 7.16 MB
- `public/hardcase1.png` - 6.53 MB
- `public/Keppler/Kfinal.jpg` - 6.52 MB
