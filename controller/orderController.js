const Category = require("../model/category");
const Products = require("../model/productsModel");
const user_route = require("../routes/userRoute");
const Order = require("../model/orderModel");
const { logout } = require("./userController");



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
            statusLevel: product.statusLevel,
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
    const id = req.body.id;
    const orderId= req.body.orderId
    const count =req.body.count
    console.log(req.body);
    console.log(req.body.id);
    console.log(req.body.orderId);


    const orderUpdate = await Order.findOneAndUpdate(
      { user: user_id, "products.product": id ,orderId:orderId},
      { $set: { "products.$.orderStatus": "Cancelled" } }
    );orderUpdate

    const updatestock = await Products.findByIdAndUpdate(
      id,
      { $inc: { stock: count } }
    );

    if (orderUpdate&&updatestock) {
     
      return res.status(200).json({ success: true  });
    } else {
    
      return res.status(404).json({ success: false });
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

  
module.exports ={
    allorders,
    cancelorder
}
