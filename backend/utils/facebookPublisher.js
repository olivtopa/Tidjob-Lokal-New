/**
 * Utility module to handle automatic publication of new offers & requests to Facebook Page via Make Webhook.
 */

const { generateAdImage } = require('./adImageGenerator');
const { uploadToFreeCdn } = require('./freeCdnUploader');
const path = require('path');
const fs = require('fs');

/**
 * Generate territory-specific and category hashtags
 */
const getHashtags = (type, category, department, zipCode, city) => {
  const tags = new Set(['#TidjobLokal', '#ServicesDeProximité', '#EntraideLocal']);
  
  if (type === 'service') {
    tags.add('#PrestationDeService');
    tags.add('#JobLokal');
  } else {
    tags.add('#DemandeDeService');
    tags.add('#BesoinDAide');
  }

  const locString = `${department || ''} ${zipCode || ''} ${city || ''}`.toLowerCase();

  if (locString.includes('971') || locString.includes('guadeloupe')) {
    tags.add('#Guadeloupe');
    tags.add('#971');
  }
  if (locString.includes('972') || locString.includes('martinique')) {
    tags.add('#Martinique');
    tags.add('#972');
  }
  if (locString.includes('973') || locString.includes('guyane')) {
    tags.add('#Guyane');
    tags.add('#973');
  }
  if (locString.includes('974') || locString.includes('réunion') || locString.includes('reunion')) {
    tags.add('#LaReunion');
    tags.add('#974');
  }
  if (locString.includes('978') || locString.includes('saint-martin')) {
    tags.add('#SaintMartin');
  }

  if (category) {
    const cleanCategory = category
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, '');
    if (cleanCategory) {
      tags.add(`#${cleanCategory}`);
    }
  }

  return Array.from(tags).join(' ');
};

const publishToFacebook = async ({
  type = 'service',
  title,
  description,
  category,
  price,
  budget,
  zipCode,
  city,
  department,
  id,
  userName
}) => {
  const webhookUrl = process.env.MAKE_FACEBOOK_WEBHOOK_URL || 'https://hook.eu1.make.com/dzdvq0y3tki64gug1mj7ujzbvwa7cupr';
  const baseUrl = process.env.FRONTEND_URL || 'https://tidjob.com';

  if (!webhookUrl) {
    console.log('ℹ️ [Facebook Auto-Publish] Webhook Make non configuré');
    return;
  }

  try {
    const isService = type === 'service';
    const postHeader = isService 
      ? '✨ [ OFFRE DE PRESTATION ] ✨\n📢 NOUVELLE ANNONCE SUR TIDJOB LOKAL !' 
      : '🆘 [ DEMANDE DE SERVICE ] 🆘\n🚨 UN MEMBRE A BESOIN DE VOTRE AIDE SUR TIDJOB LOKAL !';

    // Location formatting
    const locationParts = [];
    if (city) {
      if (zipCode) {
        locationParts.push(`${city} (${zipCode})`);
      } else {
        locationParts.push(city);
      }
    } else if (zipCode) {
      locationParts.push(`CP ${zipCode}`);
    }
    if (department) {
      locationParts.push(department);
    }
    const locationText = locationParts.length > 0 ? locationParts.join(' - ') : 'Antilles / DOM-TOM';

    // Price / Budget formatting
    const numericAmount = isService ? (price !== undefined && price !== null ? price : null) : (budget !== undefined && budget !== null ? budget : null);
    let amountText = '';
    if (isService) {
      amountText = (numericAmount && Number(numericAmount) > 0) 
        ? `💰 Tarif proposé : ${Number(numericAmount).toLocaleString('fr-FR')} €` 
        : '💰 Tarif : Sur devis / À débattre';
    } else {
      amountText = (numericAmount && Number(numericAmount) > 0) 
        ? `💰 Budget estimé : ${Number(numericAmount).toLocaleString('fr-FR')} €` 
        : '💰 Budget : À débattre';
    }

    // Author formatting
    const authorText = userName ? `👤 Publié par : ${userName}` : (isService ? '👤 Publié par un prestataire Tidjob' : '👤 Publié par un membre Tidjob');

    // Direct link to ad
    const directUrl = id 
      ? `${baseUrl}/${isService ? 'services' : 'requests'}/${id}`
      : baseUrl;

    // Clean and readable description text
    const cleanDesc = description ? description.trim() : '';

    // Hashtags
    const hashtags = getHashtags(type, category, department, zipCode, city);

    // 🎨 1. Generate Ad Graphic Image Card
    let imageUrl = '';
    try {
      const imageFilename = await generateAdImage({
        id,
        type,
        title,
        category,
        price,
        budget,
        city,
        department,
        zipCode
      });
      
      const localImagePath = path.join(__dirname, '../uploads/cards', imageFilename);
      
      // Upload generated card image to public CDN so Facebook can fetch it instantly anywhere
      console.log('☁️ Hébergement de la carte visuelle sur CDN public pour Facebook...');
      const cdnUrl = await uploadToFreeCdn(localImagePath);
      if (cdnUrl) {
        imageUrl = cdnUrl;
        console.log(`🌐 URL Publique CDN générée avec succès : ${imageUrl}`);
      }
    } catch (imgErr) {
      console.error('⚠️ [Facebook Auto-Publish] Erreur lors de la génération/upload d\'image :', imgErr.message);
    }

    // Build formatted message
    const message = `${postHeader}

📌 ${title || 'Sans titre'}

📊 DÉTAILS DE L'ANNONCE :
📂 Catégorie : ${category || 'Général'}
📍 Localisation : ${locationText}
${amountText}
${authorText}

📝 DESCRIPTION :
${cleanDesc || 'Consultez les détails complets directement sur l\'application Tidjob.'}

----------------------------------------
🔗 Pour contacter le membre ou y répondre, rendez-vous sur Tidjob :
👉 ${directUrl}
----------------------------------------

${hashtags}`;

    console.log('🚀 [Facebook Auto-Publish] Envoi du webhook vers Make.com...');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        link: directUrl,
        image_url: imageUrl, // 📸 Direct HTTPS Public CDN URL for Facebook
        type: type,
        type_label: isService ? 'Offre de prestation' : 'Demande de service',
        title: title,
        category: category || 'Général',
        city: city,
        zip_code: zipCode,
        department: department,
        location: locationText,
        price_formatted: amountText,
        author_name: userName || null,
        description: cleanDesc,
        direct_url: directUrl,
        hashtags: hashtags
      })
    });

    if (response.ok) {
      console.log('✅ [Facebook Auto-Publish Success] Webhook envoyé avec succès à Make.com !');
    } else {
      console.error('❌ [Facebook Auto-Publish Error] Le Webhook a retourné une erreur HTTP:', response.status);
    }
  } catch (error) {
    console.error('❌ [Facebook Auto-Publish Exception]', error.message);
  }
};

module.exports = {
  publishToFacebook,
  getHashtags
};
