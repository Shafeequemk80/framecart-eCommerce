
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname,"../public/produtsImages"));
  },
  filename: function (req, file, callback) {
    const name = Date.now() + "-" + file.originalname;
    callback(null, name)
  },
});

const productimagesUpload = multer({ storage: storage });

const categoryimagestoring = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname,"../public/produtsImages/icons"));
  },
  filename: function (req, file, callback) {
    const name = Date.now() + "-" + file.originalname;
    callback(null, name)
  },
});

const categoryimageupload = multer({ storage: categoryimagestoring });

module.exports={
    categoryimageupload,
    productimagesUpload
}