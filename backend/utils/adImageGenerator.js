const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

// Ensure uploads/cards directory exists
const uploadsDir = path.join(__dirname, '../uploads/cards');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Remove emojis while preserving standard French accents
 */
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    .trim();
}

/**
 * Wrap text to multiple lines within max width
 */
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      lineCount++;
      if (lineCount >= maxLines - 1 && n < words.length - 1) {
        let remaining = words.slice(n).join(' ');
        while (ctx.measureText(remaining + '...').width > maxWidth && remaining.length > 0) {
          remaining = remaining.substring(0, remaining.length - 1);
        }
        ctx.fillText(remaining + '...', x, currentY);
        return currentY;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY;
}

/**
 * Generate a visual graphic card (1080x1080px) for an ad
 */
const generateAdImage = async ({
  id,
  type = 'service',
  title,
  category,
  price,
  budget,
  city,
  department,
  zipCode
}) => {
  const width = 1080;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const FONT_FAMILY = '"DejaVu Sans", "Liberation Sans", sans-serif';
  const isService = type === 'service';
  const safeTitle = cleanText(title) || 'Nouvelle Annonce';
  const safeCategory = cleanText(category);

  // 1. Background Gradient (Tidjob Brand Teal #36B3A8 & Deep Navy/Teal)
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#0D3836');
  grad.addColorStop(0.5, '#1E6B65');
  grad.addColorStop(1, '#092124');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Decorative subtle circular glow
  const glowGrad = ctx.createRadialGradient(width * 0.8, height * 0.2, 50, width * 0.8, height * 0.2, 500);
  glowGrad.addColorStop(0, 'rgba(54, 179, 168, 0.35)');
  glowGrad.addColorStop(1, 'rgba(54, 179, 168, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.2, 500, 0, Math.PI * 2);
  ctx.fill();

  // 2. Inner Frame / Card Container
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  const margin = 50;
  ctx.beginPath();
  ctx.roundRect(margin, margin, width - margin * 2, height - margin * 2, 36);
  ctx.fill();
  ctx.stroke();

  // 3. Header Logo & Brand Name
  try {
    const logoPath = path.join(__dirname, '../../public/logo.jpg');
    if (fs.existsSync(logoPath)) {
      const logoImg = await loadImage(logoPath);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(90, 90, 100, 100, 22);
      ctx.clip();
      ctx.drawImage(logoImg, 90, 90, 100, 100);
      ctx.restore();
    }
  } catch (e) {
    console.log('⚠️ Logo image load warning:', e.message);
  }

  // Brand Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 42px ${FONT_FAMILY}`;
  ctx.fillText('Tidjob Lokal', 210, 135);

  ctx.fillStyle = '#36B3A8';
  ctx.font = `20px ${FONT_FAMILY}`;
  ctx.fillText('Services & Entraide de Proximité', 210, 170);

  // 4. Type Badge (OFFRE DE PRESTATION / DEMANDE DE SERVICE)
  const badgeY = 240;
  const badgeText = isService ? 'OFFRE DE PRESTATION' : 'DEMANDE DE SERVICE';
  ctx.fillStyle = isService ? '#36B3A8' : '#E65100';
  ctx.beginPath();
  ctx.roundRect(90, badgeY, 320, 48, 24);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 18px ${FONT_FAMILY}`;
  ctx.fillText(badgeText, 115, badgeY + 31);

  // 5. Category Pill
  if (safeCategory) {
    ctx.font = `bold 18px ${FONT_FAMILY}`;
    const catWidth = ctx.measureText(safeCategory).width + 40;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.roundRect(430, badgeY, catWidth, 48, 24);
    ctx.fill();

    ctx.fillStyle = '#E0F2F1';
    ctx.fillText(safeCategory, 450, badgeY + 31);
  }

  // 6. Title (Main Focus Text)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 46px ${FONT_FAMILY}`;
  const titleY = 380;
  wrapText(ctx, safeTitle, 90, titleY, width - 180, 64, 3);

  // 7. Location & Price Info Box
  const infoBoxY = 660;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.strokeStyle = '#36B3A8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(90, infoBoxY, width - 180, 200, 28);
  ctx.fill();
  ctx.stroke();

  // Location
  const locParts = [];
  if (city) locParts.push(zipCode ? `${city} (${zipCode})` : city);
  if (department) locParts.push(department);
  const locText = locParts.length > 0 ? locParts.join(' - ') : 'Guadeloupe / Martinique / Guyane / Réunion';

  ctx.fillStyle = '#B2DFDB';
  ctx.font = `bold 24px ${FONT_FAMILY}`;
  ctx.fillText(`LOCALISATION : ${locText}`, 130, infoBoxY + 70);

  // Price / Budget
  const numAmount = isService ? price : budget;
  let priceText = '';
  if (isService) {
    priceText = (numAmount && Number(numAmount) > 0) 
      ? `TARIF : ${Number(numAmount).toLocaleString('fr-FR')} €` 
      : 'TARIF : Sur devis / À débattre';
  } else {
    priceText = (numAmount && Number(numAmount) > 0) 
      ? `BUDGET : ${Number(numAmount).toLocaleString('fr-FR')} €` 
      : 'BUDGET : À débattre';
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 32px ${FONT_FAMILY}`;
  ctx.fillText(priceText, 130, infoBoxY + 140);

  // 8. Footer Call-To-Action Banner
  ctx.fillStyle = '#36B3A8';
  ctx.beginPath();
  ctx.roundRect(90, 910, width - 180, 80, 24);
  ctx.fill();

  ctx.fillStyle = '#092124';
  ctx.font = `bold 26px ${FONT_FAMILY}`;
  ctx.fillText('Répondre à cette annonce sur TIDJOB.COM', 200, 960);

  // Export Image Buffer & Save File
  const filename = `ad_card_${type}_${id || Date.now()}.png`;
  const filePath = path.join(uploadsDir, filename);
  const buffer = await canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);

  console.log(`🖼️ [Ad Image Generator] Carte visuelle générée avec succès : ${filename}`);
  return filename;
};

module.exports = {
  generateAdImage
};
