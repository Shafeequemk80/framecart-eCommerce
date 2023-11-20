const Category = require("../model/category");
const Products = require("../model/productsModel");
const user_route = require("../routes/userRoute");
const Order = require("../model/orderModel");



const allorders = async (req, res) => {
    try {
      const user_id = req.session.user_id;
  
      const userOrders = await Order.find({ user:user_id }).populate(
        "products.product")
        .sort({ _id: -1 });
        
  
      // Extracting product details from the orders
      const products = userOrders.reduce((allProducts, order) => {
        const orderProducts = order.products.map(product => {
          return {
            order: order,
            productDetails: product.product, // Extract the populated product details
            count: product.count,
            totalprice: product.totalprice,
            paymentStatus: product.paymentStatus,
            orderStatus: product.orderStatus,
          };
        });
        return [...allProducts, ...orderProducts];
      }, []);
      console.log(products,"1");

      res.render('allorders', { user: user_id, products: products });
    } catch (error) {
      console.log(error);
    }
  };
  
  
  


// const allorders = async (req,res)=>{
//     try {
//         const user_id=req.session.user_id
//         const orders=await Order.find({user:user_id}).sort({ _id: -1 })|| 0
//         res.render('allorders',{user:user_id,orders: orders})
//     } catch (error) {
//         console.log(error);
//     }
// }
const cancelorder = async (req, res) => {
    try {
      const user_id = req.session.user_id;
      const id = req.query.id;
  
      const orderUpdate = await Order.findOneAndUpdate(
        { user: user_id, "products.product": id },
        { $set: { "products.$.orderStatus": "Cancelled" } }
      );
  
      if (orderUpdate) {
        // The product was successfully updated in the order
        res.status(200).send("Product status updated to Cancelled.");
      } else {
        // No modifications were made, likely because the product was not found in the order
        res.status(404).send("Product not found in order.");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  };
  
module.exports ={
    allorders,
    cancelorder
}
