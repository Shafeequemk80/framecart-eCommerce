const { Admin } = require("mongodb");
const Products = require("../model/productsModel");


const saveproduct=async (req,res)=>{
try {
   
   
   const product= new Products({
    productname:req.body.productname,
    frameshape:req.body.frameshape,
    category:req.body.category,
    stock:req.body.stock,
    price:req.body.price,
    description:req.body.description,
    images:req.files.map(file => file.filename),
    brand:req.body.brand
   })

const productadded= await product.save();

res.redirect("products");
} catch (error) {
    console.log(error.message);
}


}
const addproduct=async (req,res)=>{
    try {
        res.render("addproducts")
    } catch (error) {
        console.log(error.message);
    }
}


const editproducts=async(req,res)=>{
    try {
            const id=req.query.id
            console.log(id);
        const productData=await Products.findOne({_id:id})
        console.log(productData);
        res.render('editproducts',{products:productData})
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    addproduct,
    saveproduct,
editproducts,
    
}