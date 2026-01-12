# Photo Gallery - Setup & Usage Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs:
- **sharp** - Fast image processing for thumbnails
- **exif-parser** - Extract camera metadata from photos

### 2. Organize Your Photos

Create folders for each section inside `images/originals/`:

```
images/originals/
├── urban-nights/
│   ├── IMG_001.jpg
│   ├── IMG_002.jpg
│   └── ...
├── portraits/
│   └── portrait-1.jpg
└── landscapes/
    └── landscape-1.jpg
```

### 3. Edit Content Configuration

Edit `content.json` in the root directory:

```json
{
  "sections": [
    {
      "id": "urban-nights",
      "title": "Urban Nights",
      "description": "Exploring the luminous poetry of cities after dark.",
      "folder": "urban-nights"
    }
  ]
}
```

**Fields:**
- `id` - Unique identifier (lowercase, hyphens)
- `title` - Display name for the section
- `description` - Brief description (optional)
- `folder` - Name of the folder in `images/originals/`

### 4. Build Your Gallery

```bash
npm run build
```

This will:
- ✅ Scan all images in your folders
- ✅ Extract EXIF metadata (camera, lens, settings)
- ✅ Calculate image dimensions
- ✅ Generate optimized thumbnails (400px wide)
- ✅ Create `data/photos.json` with all photo data

### 5. Preview Locally

```bash
npm run serve
```

Open http://localhost:8000 in your browser.

---

## 📸 What Metadata is Extracted?

The build script automatically extracts (if available):

- **Camera**: Make and model (e.g., "Canon EOS R5")
- **Lens**: Lens model (e.g., "RF 50mm F1.2 L USM")
- **Focal Length**: e.g., "50mm"
- **Aperture**: e.g., "f/1.8"
- **Shutter Speed**: e.g., "1/250s"
- **ISO**: e.g., "ISO 400"
- **Date Taken**: From EXIF or file creation date
- **Dimensions**: Width × Height in pixels

**If a photo has no EXIF data**, the script will:
- Still extract dimensions from the image
- Use file creation date as the photo date
- Skip displaying missing metadata fields

---

## 🌐 Deployment Options

### Option A: Manual Deploy (Recommended for beginners)

1. Run `npm run build` locally
2. Upload all website files (index.html, contact.html, js/, css/, images/, data/) to your host
3. Works with any static hosting service

**Hosting Services:**
- [GitHub Pages](https://pages.github.com/) - Free
- [Netlify](https://www.netlify.com/) - Free tier
- [Vercel](https://vercel.com/) - Free tier
- [Cloudflare Pages](https://pages.cloudflare.com/) - Free

### Option B: Hybrid (Recommended for Git users)

1. Add to `.gitignore`:
```
# Large original files - keep locally only
images/originals/

# Node modules
node_modules/
```

2. Run `npm run build` locally
3. Commit only:
   - `images/thumbs/` (small)
   - `data/photos.json` (tiny)
   - All website files (HTML, JS, CSS)
4. Push to Git and deploy

**Advantages:**
- ✅ Small Git repo
- ✅ Fast deploys
- ✅ Keep full-res images on your machine

### GitHub Pages Example:

```bash
# After building
git add .
git commit -m "Update photos"
git push origin main

# Enable GitHub Pages in repo settings:
# Settings → Pages → Source: main branch → / (root)
```

Your site will be at: `https://yourusername.github.io/your-repo-name/`

---

## 📁 File Structure

```
photo-post-realism-fun/
├── content.json              ← Edit this: section names & descriptions
├── package.json              ← Dependencies
├── build-photos.js           ← Build script (don't edit)
├── index.html
├── contact.html
├── js/
│   ├── home.js              ← Loads from data/photos.json
│   └── layout.js
├── images/
│   ├── originals/           ← YOUR PHOTOS GO HERE
│   │   ├── urban-nights/
│   │   ├── portraits/
│   │   └── ...
│   └── thumbs/              ← Auto-generated thumbnails
│       ├── urban-nights/
│       └── ...
└── data/
    └── photos.json          ← Auto-generated photo data
```

---

## 🔄 Updating Your Gallery

### Adding New Photos

1. Drop new photos into appropriate folder in `images/originals/`
2. Run `npm run build`
3. Deploy updated files

### Adding New Sections

1. Create new folder in `images/originals/` (e.g., `wildlife/`)
2. Add photos to the folder
3. Edit `content.json` and add new section:
```json
{
  "id": "wildlife",
  "title": "Wildlife",
  "description": "Nature in its untamed beauty.",
  "folder": "wildlife"
}
```
4. Run `npm run build`
5. Deploy

### Changing Section Order

Just reorder sections in `content.json` - the website respects this order.

---

## 🛠️ Troubleshooting

### "photos.json not found" in console

This is normal on first run! The site shows demo data until you run `npm run build`.

### Images not loading after build

Check that paths in `photos.json` match your folder structure:
```json
"url": "/images/originals/urban-nights/photo.jpg"
```

If hosted in a subdirectory, you may need to update paths in `build-photos.js`:
```javascript
url: `/your-subdirectory/images/originals/${section.folder}/${filename}`,
```

### Build script errors

**"Cannot find module 'sharp'"**
- Run `npm install` first

**"ENOENT: no such file or directory"**
- Make sure folder names in `content.json` match actual folders in `images/originals/`

**HEIC/HEIF images not processing**
- Install libheif: 
  - Mac: `brew install libheif`
  - Ubuntu: `sudo apt-get install libheif-examples`

---

## 🎨 Customization

### Thumbnail Size

Edit `build-photos.js`:
```javascript
const CONFIG = {
  thumbWidth: 400, // Change this (default: 400px)
  // ...
};
```

### Thumbnail Quality

Edit `build-photos.js` in the `processImage` function:
```javascript
.jpeg({ quality: 85 }) // Change 85 to 70-95
```

---

## 📝 Demo Data

The site includes demo data (random placeholder images) that displays automatically if `data/photos.json` doesn't exist. This lets you:
- Preview the layout immediately
- Test features before adding your photos

Once you run `npm run build`, your real photos will replace the demo data.

---

## 💡 Tips

1. **Use descriptive filenames** - They help you organize
2. **Keep originals safe** - Don't delete them after building
3. **Backup your `content.json`** - It's your gallery structure
4. **Test locally first** - Always run `npm run serve` before deploying
5. **Optimize before uploading** - Large originals (>5MB) work fine locally but may slow down hosting
6. **Sort alphabetically** - Files are processed in alphabetical order within each section

---

## 🆘 Need Help?

Check that:
- [ ] Node.js is installed (`node --version`)
- [ ] Dependencies are installed (`npm install`)
- [ ] Folder names in `content.json` match actual folders
- [ ] Images are in supported formats (JPG, PNG, WebP, HEIC)
- [ ] You ran `npm run build` after making changes
