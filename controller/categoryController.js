const category = require("../model/categoryModel");
const Category = require("../model/categoryModel");
const Offer = require("../model/offerModel");
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
    var search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    console.log(search, "search value ");
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }

    var limit = 5;

    const categoryData = await Category.find({
      $or: [
        { categoryname: { $regex: ".*" + search + ".*", $options: "i" } },
       
      ],
    })

      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('offer')
      .exec();

    const count = await Category.find({
      $or: [
        { categoryname: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    }).countDocuments();


    const offerData = await Offer.find({ action: 1 });

   
    res.render("category", 
    { category: categoryData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previospage: page - 1,
      nextpage: parseInt(page) + 1,
      count: count,
      offerData:offerData,
      search: search, });
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
