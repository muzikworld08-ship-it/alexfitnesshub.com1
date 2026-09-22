const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function run() {
  const publicDir = path.join(__dirname, '..', 'public');
  const iconsDir = path.join(publicDir, 'icons');

  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const standardSvg = fs.readFileSync(path.join(iconsDir, 'icon.svg'));
  const maskableSvg = fs.readFileSync(path.join(iconsDir, 'icon-maskable.svg'));

  console.log('Generating PWA icons...');

  // 1. icon-512.png
  await sharp(standardSvg)
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(iconsDir, 'icon-512.png'));
  console.log('✓ Created /icons/icon-512.png');

  // 2. icon-192.png
  await sharp(standardSvg)
    .resize(192, 192)
    .png({ quality: 100 })
    .toFile(path.join(iconsDir, 'icon-192.png'));
  console.log('✓ Created /icons/icon-192.png');

  // 3. icon-maskable-512.png
  await sharp(maskableSvg)
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(iconsDir, 'icon-maskable-512.png'));
  console.log('✓ Created /icons/icon-maskable-512.png');

  // 4. apple-touch-icon.png (180x180)
  await sharp(standardSvg)
    .resize(180, 180)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Created /apple-touch-icon.png');

  // 5. favicon.png (64x64)
  await sharp(standardSvg)
    .resize(64, 64)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('✓ Created /favicon.png');

  // 6. Copies at root public directory for backwards compatibility
  fs.copyFileSync(path.join(iconsDir, 'icon-512.png'), path.join(publicDir, 'icon-512.png'));
  fs.copyFileSync(path.join(iconsDir, 'icon-192.png'), path.join(publicDir, 'icon-192.png'));

  // 7. Update JPG icons as well so any legacy references get the new branding
  await sharp(standardSvg)
    .resize(512, 512)
    .jpeg({ quality: 95 })
    .toFile(path.join(publicDir, 'icon-512.jpg'));
  await sharp(standardSvg)
    .resize(192, 192)
    .jpeg({ quality: 95 })
    .toFile(path.join(publicDir, 'icon-192.jpg'));
  await sharp(standardSvg)
    .resize(64, 64)
    .jpeg({ quality: 95 })
    .toFile(path.join(publicDir, 'favicon.jpg'));

  console.log('All icons generated successfully!');
}

run().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
