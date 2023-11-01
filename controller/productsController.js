const Products = require("../model/productsModel");


const addproduct=async (req,res)=>{
try {
   
   
   const product= new Products({
    productname:req.body.productname,
    frameshape:req.body.frameshape,
    category:req.body.category,
    stock:req.body.stock,
    price:req.body.price,
    description:req.body.description,
    images:req.file.filename,
    brand:req.body.brand
   })

const productadded= await product.save();

console.log(productadded);
res.redirect("/admin/dashboard");
} catch (error) {
    console.log(error.message);
}


}

module.exports={
    addproduct
}