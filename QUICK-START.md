# Quick Start - 3 Steps to Your Photo Gallery

## 1️⃣ Install
```bash
npm install
```

## 2️⃣ Add Your Photos

```
images/originals/
├── urban-nights/
│   ├── photo1.jpg
│   └── photo2.jpg
└── portraits/
    └── portrait1.jpg
```

Edit `content.json` with your section names:
```json
{
  "homeIntroText": "Real places re‑imagined — crafted in the digital darkroom. Click an image to open, then swipe or use arrows to browse each series.",
  "aboutPage": {
    "subheading": "Bio",
    "paragraphs": [
      "Your first About paragraph...",
      "Your second About paragraph..."
    ]
  },
  "sections": [
    {
      "id": "urban-nights",
      "title": "Urban Nights",
      "description": "City lights and shadows",
      "folder": "urban-nights"
    }
  ]
}
```

### Editable site text (no rebuild needed)

- **Homepage intro line**: edit `content.json` → `homeIntroText`
- **About page text**: edit `content.json` → `aboutPage.subheading` and `aboutPage.paragraphs`

## 3️⃣ Build & Preview

```bash
npm run build    # Generate thumbnails & extract metadata
npm run serve    # View at http://localhost:8000
```

---

## What Gets Automated ✨

✅ **File Renaming** - Leading underscores removed (GitHub Pages fix)
✅ **Thumbnails** - Generated at 400px wide (grid view)
✅ **Web Versions** - Generated at 2560px max (lightbox view)  
✅ **EXIF Metadata** - Camera, lens, settings extracted  
✅ **Dimensions** - Width × height calculated  
✅ **JSON File** - All data compiled into `data/photos.json`
✅ **Social Preview** - First photo automatically set as og:image in `index.html`

No manual data entry needed! Just drop files with any name (even with underscores), and everything is handled automatically. Your originals stay private, only optimized versions are deployed.

---

## Deploy

**Simple way:**
1. Run `npm run build`
2. Upload all files to any static host
3. Done!

**Recommended hosts:** GitHub Pages, Netlify, Vercel (all free)

See [SETUP-GUIDE.md](SETUP-GUIDE.md) for detailed instructions.
