const Products = require("../model/productsModel");

const Category = require("../model/categoryModel");
const saveproduct = async (req, res) => {
  try {
    const imagesArray = [];

    for (let i = 1; i <= 4; i++) {
      if (req.files[`image${i}`]) {
        imagesArray.push(req.files[`image${i}`][0].filename);
      }
    }

    const product = new Products({
      productname: req.body.productname,
      frameshape: req.body.frameshape,
      category: req.body.category,
      stock: req.body.stock,
      price: req.body.price,
      description: req.body.description,
      images: {
        image1: imagesArray[0] || "", // Default to empty string if undefined
        image2: imagesArray[1] || "",
        image3: imagesArray[2] || "",
        image4: imagesArray[3] || "",
      },
      brand: req.body.brand,
      createdAt: Date.now(),
    });

    const productadded = await product.save();

    res.json({ success: true });
  } catch (error) {
    res.render("500");
  }
};

const addproduct = async (req, res) => {
  try {
    const categoryData = await Category.find();

    res.render("addproducts", { category: categoryData });
  } catch (error) {
    res.render("500");
  }
};

const editproducts = async (req, res) => {
  try {
    const id = req.query.id;

    const categoryData = await Category.find();
    const productData = await Products.findOne({ _id: id });

    res.render("editproducts", {
      products: productData,
      category: categoryData,
      updatedAt: Date.now(),
    });
  } catch (error) {
    res.render("500");
  }
};

const saveditproducts = async (req, res) => {
  try {
    const id = req.body.user_id;
    const existingProduct = await Products.findById(id);

    // Update existing product with new data
    existingProduct.productname = req.body.productname;
    existingProduct.frameshape = req.body.frameshape;
    existingProduct.description = req.body.description;
    existingProduct.price = req.body.price;
    existingProduct.stock = req.body.stock;

    // Update images object based on uploaded files or keep existing images
    existingProduct.images = {
      image1: req.files.image1
        ? req.files.image1[0].filename
        : existingProduct.images.image1,
      image2: req.files.image2
        ? req.files.image2[0].filename
        : existingProduct.images.image2,
      image3: req.files.image3
        ? req.files.image3[0].filename
        : existingProduct.images.image3,
      image4: req.files.image4
        ? req.files.image4[0].filename
        : existingProduct.images.image4,
    }; 

    existingProduct.updatedAt = Date.now();

    // Save the updated product to the database
    await existingProduct.save();

    // Redirect or send a response indicating success
    res.json({ success: true }); // Change this based on your application flow
  } catch (error) {
    res.render("500");
  }
};

const activeproduct = async (req, res) => {
  try {
    const id = req.query.id;

    const active = await Products.updateOne(
      { _id: id },
      { $set: { active: 0 } }
    );

    res.redirect("/admin/products");
  } catch (error) {
    res.render("500");
  }
};
const suspendproduct = async (req, res) => {
  try {
    const id = req.query.id;

    const suspend = await Products.updateOne(
      { _id: id },
      { $set: { active: 1 } }
    );

    res.redirect("/admin/products");
  } catch (error) {
    res.render("500");
  }
};

module.exports = {
  addproduct,
  saveproduct,
  editproducts,
  saveditproducts,
  activeproduct,
  suspendproduct,
};
