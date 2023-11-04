
const Category = require("../model/category");

const loadcatergory = async (req,res)=>{
    try {
        res.render("addcategory");
    } catch (error) {
        console.log(error.message);
    }

}

const savecategory=async (req,res)=>{

    try {
        console.log(req.body.checkbox,);
        const addcategory= new Category({

            categoryname:req.body.categoryname,
            icon:req.file.filename,
            createdAt:Date.now()
        })
        const added=await addcategory.save();

        res.redirect("category")
    } catch (error) {
        console.log(error.message);
    }
}

const loadcategorypage=async (req,res)=>{

    try {
        const categoryData=await Category.find().sort({createdAt:-1})
        res.render("category",{category:categoryData})


    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    loadcatergory,
    savecategory,
    loadcategorypage
}