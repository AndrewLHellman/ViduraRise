const AWS = require("aws-sdk");
const crypto = require("crypto");
require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

let s3 = new AWS.S3();

var cipher = crypto.createCipheriv(
  process.env.ALGORITHM,
  process.env.SECURITYKEY,
  process.env.INITVECTOR
);
cipher.setAutoPadding(false);

var decipher = crypto.createDecipheriv(
  process.env.ALGORITHM,
  process.env.SECURITYKEY,
  process.env.INITVECTOR
);
decipher.setAutoPadding(false);

function toB64padded(plaintext, blocksize) {
  var bufPlaintext = Buffer.from(plaintext, "utf8");
  var bufPlaintextB64 = Buffer.from(bufPlaintext.toString("base64"), "utf8");
  var bufPadding = Buffer.alloc(
    blocksize - (bufPlaintextB64.length % blocksize)
  );
  return Buffer.concat([bufPlaintextB64, bufPadding]);
}

const encode = async (data) => {
  let buf = Buffer.from(data);
  let base64 = buf.toString("base64");
  return base64;
};

const getImage = async (storage, filename) => {
  const data = await s3
    .getObject({
      Bucket: storage,
      Key: filename,
    })
    .promise();
  // console.log(data);
  return data;
};

const Jimp = require('jimp');

// Assuming you have base64-encoded TIFF image data
const base64TiffData = 'YOUR_BASE64_TIFF_IMAGE_DATA_HERE';

// Function to convert TIFF to PNG
async function convertTiffToPng(base64TiffData) {
  try {
    // Load the TIFF image from base64 data
    const tiffImage = await Jimp.read(Buffer.from(base64TiffData, 'base64'));

    // Convert the image to PNG format
    const pngBuffer = await tiffImage.getBufferAsync(Jimp.MIME_PNG);

    // Convert the PNG buffer to base64
    const base64PngData = pngBuffer.toString('base64');

    return base64PngData;
  } catch (error) {
    console.error('Conversion error:', error);
    return null;
  }
}

module.exports = { s3, cipher, decipher, toB64padded, getImage, encode, convertTiffToPng };
