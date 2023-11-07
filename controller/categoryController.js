const category = require("../model/category");
const Category = require("../model/category");

const loadcatergory = async (req, res) => {
  try {
    res.render("addcategory");
  } catch (error) {
    console.log(error.message);
  }
};

const savecategory = async (req, res) => {
  try {
    const newname=req.body.categoryname;
    const regex = new RegExp(newname, 'i');
    const check=await Category.find({categoryname:{$regex: regex}})
    if(check.length>0){
res.render("addcategory",{message:`Category with name "${newname}" already exists.`})

    }else{


    const addcategory = new Category({
      categoryname: req.body.categoryname,
      icon: req.file.filename,
      createdAt: Date.now(),
    });
    const added = await addcategory.save();

    res.redirect("category");
}
  } catch (error) {
    console.log(error.message);
  }
};

const loadcategorypage = async (req, res) => {
  try {
    const categoryData = await Category.find({}).sort({ createdAt: -1 });
    res.render("category", { category: categoryData });
  } catch (error) {
    console.log(error.message);
  }
};

const suspendcategory = async (req, res) => {
  try {
    const id = req.query.id;

    const suspend = await Category.updateOne(
      { _id: id },
      { $set: { active: 1 } }
    );
    res.redirect("category");
  } catch (error) {
    console.log(error.message);
  }
};

const activecategory = async (req, res) => {
  try {
    const id = req.query.id;

    const active = await Category.updateOne(
      { _id: id },
      { $set: { active: 0 } }
    );
    res.redirect("category");
  } catch (error) {}
};

module.exports = {
  loadcatergory,
  savecategory,
  loadcategorypage,
  suspendcategory,
  activecategory,
};
