const Products = require("../model/productsModel");

const Category = require("../model/category");
const saveproduct = async (req, res) => {
  try {
    const filenames = req.files.map((file) => file.filename);
    const product = new Products({
      productname: req.body.productname,
      frameshape: req.body.frameshape,
      category: req.body.category,
      stock: req.body.stock,
      price: req.body.price,
      description: req.body.description,
      images: filenames,
      brand: req.body.brand,
      createdAt:Date.now()
    });

    const productadded = await product.save();

    res.redirect("products");
  } catch (error) {
    console.log(error.message);
  }
};
const addproduct = async (req, res) => {
  try {
    const categoryData = await Category.find();

    res.render("addproducts", { category: categoryData });
  } catch (error) {
    console.log(error.message);
  }
};

const editproducts = async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    const categoryData = await Category.find();
    const productData = await Products.findOne({ _id: id });
    console.log(productData);
    res.render("editproducts", {
      products: productData,
      category: categoryData,
      updatedAt:Date.now()
    });
  } catch (error) {
    console.log(error.message);
  }
};
const saveditproducts = async (req, res) => {
  try {
    const id = req.query.id;
    const filenames = req.files.map((file) => file.filename);
    const product = await Products.updateOne(
      { _id: id },
      {
        $set: {
          productname: req.body.productname,
          frameshape: req.body.frameshape,
          category: req.body.category,
          stock: req.body.stock,
          price: req.body.price,
          description: req.body.description,
          images: filenames,
          brand: req.body.brand,
          createdAt:Date.now()
        },
      }
    );

    res.redirect("products");
  } catch (error) {
    console.log(error.message);
  }
};
const activeproduct=async(req,res)=>{
  try {
    const id = req.query.id;
  
    const active = await Products.updateOne(
      { _id: id },
      { $set: { active: 0 } }
    );
    

    res.redirect("/admin/products");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const suspendproduct=async(req,res)=>{
  try {
    const id = req.query.id;
    console.log(id);
    const suspend = await Products.updateOne(
      { _id: id },
      { $set: { active: 1 } }
    );
    
    console.log(suspend);
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}



module.exports = {
  addproduct,
  saveproduct,
  editproducts,
  saveditproducts,
  activeproduct,
  suspendproduct,
};
