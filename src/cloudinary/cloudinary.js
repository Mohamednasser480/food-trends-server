
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "foodtrends",
  api_key: "865779332645162",
  api_secret: "AUFd5gRpZUcVUV5UXAfWtJYaI90",
});
module.exports = { cloudinary };
