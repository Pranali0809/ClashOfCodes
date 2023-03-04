const multer = require("multer");
const cloudinary = require("cloudinary");
const { ErrorHandler } = require("../utils/errorHandler");

cloudinary.config({
  cloud_name: 'duv6bblex',
  api_key: '596868851646894',
  api_secret: 'KuJsBWqOY3cwUjOjkru7eR4H5kM',
});

const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage,
});

const uploadToCloudinary = async (fileString, format) => {
  try {
    const { uploader } = cloudinary;

    const res = await uploader.upload(
      `data:image/${format};base64,${fileString}`
    );

    return res;
  } catch (error) {
    throw new ErrorHandler(500, error);
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
};