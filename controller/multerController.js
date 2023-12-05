
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../public/productsImages"));
  },
  filename: function (req, file, callback) {
    const name = Date.now() + "-" + file.originalname;
    callback(null, name);
  },
});

const uploadProduct = multer({ storage: storage });


const categoryimagestoring = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname,"../public/productsImages/icons"));
  },
  filename: function (req, file, callback) {
    const name = Date.now() + "-" + file.originalname;
    callback(null, name)
  },
});
const categoryimageupload = multer({ storage: categoryimagestoring });
const productImagesUpload = uploadProduct.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
]);





module.exports={
  categoryimageupload,
    productImagesUpload
}