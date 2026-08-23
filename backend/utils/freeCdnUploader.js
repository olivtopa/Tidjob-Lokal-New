const fs = require('fs');

/**
 * Upload local file to free public CDN (Catbox/Litterbox)
 * Returns public HTTPS direct URL accessible by Facebook & Make.com
 */
async function uploadToFreeCdn(filePath) {
  try {
    const fileStream = fs.createReadStream(filePath);
    const filename = filePath.split('/').pop();

    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('time', '72h'); // Host image publicly for 72 hours
    formData.append('fileToUpload', new Blob([fs.readFileSync(filePath)]), filename);

    const res = await fetch('https://litterbox.catbox.moe/resources/internals/api.php', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const imageUrl = await res.text();
      return imageUrl.trim();
    } else {
      console.error('❌ Failed to upload to free CDN:', res.status);
      return null;
    }
  } catch (err) {
    console.error('⚠️ Free CDN upload exception:', err.message);
    return null;
  }
}

module.exports = {
  uploadToFreeCdn
};
