const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const exifParser = require('exif-parser');

// Configuration
const CONFIG = {
  contentFile: './content.json',
  outputFile: './data/photos.json',
  originalsDir: './images/originals',
  webDir: './images/web',           // Web versions for lightbox
  thumbsDir: './images/thumbs',
  thumbWidth: 400,                  // Width for thumbnails (grid)
  webMaxDimension: 2560,            // Max dimension for web versions (lightbox)
  imageExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']
};

// Ensure directories exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Extract EXIF data from image buffer
function extractExif(buffer) {
  try {
    const parser = exifParser.create(buffer);
    const result = parser.parse();
    return result.tags;
  } catch (error) {
    console.warn('Could not parse EXIF data:', error.message);
    return null;
  }
}

// Format camera name
function formatCamera(exif) {
  if (!exif) return null;
  
  const make = exif.Make?.trim();
  const model = exif.Model?.trim();
  
  if (make && model) {
    // Remove redundant make name from model if present
    const modelClean = model.startsWith(make) ? model : `${make} ${model}`;
    return modelClean;
  } else if (model) {
    return model;
  } else if (make) {
    return make;
  }
  
  return null;
}

// Format lens name
function formatLens(exif) {
  if (!exif) return null;
  
  return exif.LensModel?.trim() || exif.LensInfo?.trim() || null;
}

// Format focal length
function formatFocalLength(exif) {
  if (!exif || !exif.FocalLength) return null;
  return `${Math.round(exif.FocalLength)}mm`;
}

// Format aperture
function formatAperture(exif) {
  if (!exif || !exif.FNumber) return null;
  return `f/${exif.FNumber.toFixed(1)}`;
}

// Format ISO
function formatISO(exif) {
  if (!exif || !exif.ISO) return null;
  return `ISO ${exif.ISO}`;
}

// Format shutter speed
function formatShutterSpeed(exif) {
  if (!exif || !exif.ExposureTime) return null;
  const speed = exif.ExposureTime;
  if (speed >= 1) {
    return `${speed}s`;
  } else {
    return `1/${Math.round(1 / speed)}s`;
  }
}

// Get date from EXIF or file stats
function getPhotoDate(exif, fileStats) {
  if (exif && exif.DateTimeOriginal) {
    return new Date(exif.DateTimeOriginal * 1000).toISOString();
  } else if (exif && exif.CreateDate) {
    return new Date(exif.CreateDate * 1000).toISOString();
  } else {
    return fileStats.birthtime.toISOString();
  }
}

// Process a single image
async function processImage(imagePath, section, index) {
  const filename = path.basename(imagePath);
  const fileStats = fs.statSync(imagePath);
  
  console.log(`Processing: ${section.folder}/${filename}`);
  
  // Read image buffer
  const buffer = fs.readFileSync(imagePath);
  
  // Extract EXIF
  const exif = extractExif(buffer);
  
  // Get image metadata using sharp
  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  // Generate thumbnail
  const thumbDir = path.join(CONFIG.thumbsDir, section.folder);
  ensureDir(thumbDir);
  const thumbPath = path.join(thumbDir, filename);
  
  await sharp(buffer)
    .resize(CONFIG.thumbWidth, null, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: 85 })
    .toFile(thumbPath);
  
  console.log(`  ✓ Thumbnail created`);
  
  // Generate web version (for lightbox display)
  const webDir = path.join(CONFIG.webDir, section.folder);
  ensureDir(webDir);
  const webPath = path.join(webDir, filename);
  
  await sharp(buffer)
    .resize(CONFIG.webMaxDimension, CONFIG.webMaxDimension, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: 90, mozjpeg: true }) // Higher quality for viewing
    .toFile(webPath);
  
  console.log(`  ✓ Web version created`);
  
  // Get web version dimensions (these are what users will see)
  const webMetadata = await sharp(webPath).metadata();
  
  // Build photo data object - only include fields that exist
  const photoData = {
    id: `${section.id}-${index + 1}`,
    url: `/images/web/${section.folder}/${filename}`,
    thumb: `/images/thumbs/${section.folder}/${filename}`,
    width: webMetadata.width,
    height: webMetadata.height,
    date: getPhotoDate(exif, fileStats)
  };
  
  // Add EXIF metadata only if available
  const camera = formatCamera(exif);
  if (camera) photoData.camera = camera;
  
  const lens = formatLens(exif);
  if (lens) photoData.lens = lens;
  
  const focalLength = formatFocalLength(exif);
  if (focalLength) photoData.focalLength = focalLength;
  
  const aperture = formatAperture(exif);
  if (aperture) photoData.aperture = aperture;
  
  const iso = formatISO(exif);
  if (iso) photoData.iso = iso;
  
  const shutterSpeed = formatShutterSpeed(exif);
  if (shutterSpeed) photoData.shutterSpeed = shutterSpeed;
  
  console.log(`  ✓ Metadata extracted`);
  
  return photoData;
}

// Process all images in a section folder
async function processSection(section) {
  const sectionDir = path.join(CONFIG.originalsDir, section.folder);
  
  if (!fs.existsSync(sectionDir)) {
    console.warn(`⚠️  Warning: Folder not found: ${sectionDir}`);
    return {
      ...section,
      photos: []
    };
  }
  
  // Get all image files
  const files = fs.readdirSync(sectionDir)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return CONFIG.imageExtensions.includes(ext);
    })
    .sort(); // Alphabetical order
  
  if (files.length === 0) {
    console.warn(`⚠️  Warning: No images found in ${sectionDir}`);
    return {
      ...section,
      photos: []
    };
  }
  
  console.log(`\n📁 Processing section: ${section.title} (${files.length} images)`);
  
  // Process each image
  const photos = [];
  for (let i = 0; i < files.length; i++) {
    const imagePath = path.join(sectionDir, files[i]);
    try {
      const photoData = await processImage(imagePath, section, i);
      photos.push(photoData);
    } catch (error) {
      console.error(`  ✗ Error processing ${files[i]}:`, error.message);
    }
  }
  
  return {
    id: section.id,
    title: section.title,
    description: section.description,
    photos
  };
}

// Main build function
async function build() {
  console.log('🚀 Starting photo build process...\n');
  
  // Ensure output directory exists
  ensureDir(path.dirname(CONFIG.outputFile));
  
  // Read content configuration
  let content;
  try {
    content = JSON.parse(fs.readFileSync(CONFIG.contentFile, 'utf8'));
  } catch (error) {
    console.error('❌ Error reading content.json:', error.message);
    process.exit(1);
  }
  
  // Process all sections
  const sections = [];
  for (const section of content.sections) {
    const processedSection = await processSection(section);
    sections.push(processedSection);
  }
  
  // Write output JSON
  const output = { sections };
  fs.writeFileSync(CONFIG.outputFile, JSON.stringify(output, null, 2));
  
  console.log(`\n✅ Build complete!`);
  console.log(`📄 Generated: ${CONFIG.outputFile}`);
  
  // Summary
  const totalPhotos = sections.reduce((sum, s) => sum + s.photos.length, 0);
  console.log(`\n📊 Summary:`);
  console.log(`   Sections: ${sections.length}`);
  console.log(`   Photos: ${totalPhotos}`);
}

// Run build
build().catch(error => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
