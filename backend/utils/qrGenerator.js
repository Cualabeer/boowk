const QRCode = require('qrcode');

async function generateQRCode(text) {
  return await QRCode.toDataURL(text);
}

module.exports = generateQRCode;