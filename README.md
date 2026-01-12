# Photo Post-Realism Is Fun

Portfolio by **Leonid Yanovich**

A modern, minimalist photo gallery with automated image processing and metadata extraction. Built with vanilla JavaScript and designed for photographers who want a beautiful portfolio without the hassle of manual data entry.

## ✨ Features

- 📸 **Automatic EXIF Extraction** - Camera, lens, and shooting settings pulled from your photos
- 🖼️ **Auto-Generated Thumbnails** - Optimized for web performance
- 📱 **Fully Responsive** - Beautiful on desktop, tablet, and mobile
- 🎨 **Cross-Fade Lightbox** - Smooth transitions with swipe/arrow navigation
- 🏷️ **Smart Sections** - Organize photos into themed collections
- 🚀 **Static Site** - Deploy anywhere, no server required
- 🎯 **Zero Manual Entry** - Just drop images and build

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your photos
# Place images in: images/originals/your-section-name/

# 3. Configure sections
# Edit content.json with your section names

# 4. Build gallery
npm run build

# 5. Preview
npm run serve
# Open http://localhost:8000
```

See [QUICK-START.md](QUICK-START.md) for step-by-step instructions.

## 📖 Documentation

- **[QUICK-START.md](QUICK-START.md)** - Get up and running in 3 steps
- **[SETUP-GUIDE.md](SETUP-GUIDE.md)** - Complete guide with deployment options and troubleshooting

## 🛠️ How It Works

### What You Do:
1. Drop photos into folders
2. Edit a simple JSON file with section names
3. Run `npm run build`

### What Happens Automatically:
- ✅ **Thumbnails** generated (400px wide for grid view)
- ✅ **Web versions** generated (2560px max for lightbox - protects originals!)
- ✅ **EXIF metadata** extracted (camera, lens, settings, date)
- ✅ **Image dimensions** calculated
- ✅ **Complete data file** created (`data/photos.json`)
- ✅ **Social preview image** updated in `index.html` (uses first photo from first section)

### What You See:
- Beautiful responsive gallery
- Lightbox with image metadata
- Organized sections
- Smooth animations

## 📁 Project Structure

```
photo-post-realism-fun/
├── content.json              # Edit: section names & descriptions
├── build-photos.js           # Build script (auto-processes images)
├── package.json              # Dependencies
├── index.html                # Home page
├── contact.html              # Contact page
├── js/                       # Site JavaScript
├── css/                      # Styles
├── images/
│   ├── originals/            # 📸 YOUR PHOTOS GO HERE (not deployed)
│   ├── web/                  # Auto-generated web versions (deployed)
│   └── thumbs/               # Auto-generated thumbnails (deployed)
└── data/
    └── photos.json           # Auto-generated photo data
```

## 🌐 Deployment

Works with any static hosting service:
- **GitHub Pages** - Free, easy integration with Git
- **Netlify** - Free tier, automatic deploys
- **Vercel** - Free tier, excellent performance
- **Cloudflare Pages** - Free, fast CDN

### Deploy Steps:
1. Run `npm run build` locally
2. Upload all website files to your hosting service
3. Done!

See [SETUP-GUIDE.md](SETUP-GUIDE.md) for detailed deployment options including hybrid Git approach.

## 🛡️ Image Protection

Your original high-resolution files are **protected**:

- **Originals**: Stay on your machine only (excluded from Git)
- **Web versions**: 2560px max dimension for online viewing
- **Thumbnails**: 400px for grid display

Perfect for 32" monitors but not suitable for printing or detailed zooming. Your master files remain private!

## 📸 Metadata Support

Automatically extracts and displays (when available):
- Camera make and model
- Lens information
- Focal length
- Aperture (f-stop)
- Shutter speed
- ISO sensitivity
- Date taken

**Missing metadata?** No problem - fields are only shown if they exist in your photo's EXIF data.

## 🎨 Gallery Features

### Desktop
- Section navigation bar with all photo collections
- Responsive grid layout
- Full-screen lightbox with keyboard navigation
- Cross-fade transitions between images
- Mouse wheel / trackpad swipe support

### Mobile
- Expandable section menu with smooth animations
- Touch-friendly grid
- Single-finger swipe navigation in lightbox
- Optimized image sizing for mobile screens
- Auto-hiding footer to maximize screen space

## 🔧 Requirements

- **Node.js** 14+ (for image processing)
- **npm** (comes with Node.js)

## 📝 License

MIT

## 🤝 Contributing

This is a personal portfolio project, but feel free to fork and adapt it for your own use!

## 💡 Tips

- **Keep originals** - Don't delete source images after building
- **Use descriptive folder names** - They help organize your collections
- **Test locally first** - Always preview with `npm run serve` before deploying
- **Commit thumbnails** - Include generated thumbnails in Git to keep originals private

---

Made for photographers who code, or coders who photograph. 📷✨
