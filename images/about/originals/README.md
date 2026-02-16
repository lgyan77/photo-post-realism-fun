# About page before/after images

Upload **two full-size images** here (your originals). They can be any of:
- `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`, `.heif`

Recommended naming (helps auto-detection):
- Include `before` in the filename for the “before” image
- Include `after` in the filename for the “after” image

Examples:
- `my-example-before.jpg`
- `my-example-after.jpg`

Then run:

```bash
npm run build
```

This will generate thumbnails into `images/about/thumbs/` and write `data/about.json`, which `about.html` uses.

