const Cart = require("../model/cartModel");
const Product = require("../model/productsModel");
const Address = require("../model/addressModel");
const Order = require("../model/orderModel");
const { Timestamp } = require("mongodb");


function generateOrderId() {
  // Generate a random identifier (6 characters)
  const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Get the current timestamp
  const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);

  // Combine timestamp and random identifier
  const orderId = `${timestamp}-${randomId}`;

  return orderId;
}



const loadcheckout = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    
    const cartData = await Cart.findOne({ user: user_id }).populate("products.product");

    console.log(0)

    if (cartData&& cartData.products.length !== 0) {
     
      return res.json({ cartItem: true });

    } else {
      return res.json({ cartEmpty: true });
    }
  } catch (error) {
    console.error(error);
    return res.render('error', { message: 'An error occurred during checkout.' });
  }
};


const getcheckout=async(req,res)=>{


    try {

        const user_id=req.session.user_id
        const address=await Address.findOne({user:user_id}).sort({ _id: -1 })|| 0
        const cartData = await Cart.findOne({ user: user_id }).populate(
            "products.product"
          );
        res.render('checkout',{user:user_id,address:address.address,cart: cartData})
    } catch (error) {
        console.log(error);
    }
}


const verifypayment = async (req, res) => {
    try {
      const user_id = req.session.user_id;
      const addressId = req.body.selectedAddress;
      const paymentType = req.body.paymentType;

    let totalamount = 0;

      const cartData= await Cart.findOne({user:user_id})
       
      // const addressData = await Address.find({user:user_id},{"address._id":addressId})
      const allAddres = await Address.findOne({user:user_id})
      // console.log(allAddres.address);
      const SelectedAddress = allAddres.address.find((addr=>{
        return addr._id.toString() == addressId.toString()
      }))
      console.log(SelectedAddress);

      for (const price of cartData.products) {
        totalamount = price.totalprice;
       
      }


      if (paymentType === "COD") {


        const orderDate= new Date()
        const newOrderId = generateOrderId();
        let productsData = cartData.products.map(productItem => ({
            product: productItem.product,
            count: productItem.count,
            totalprice: productItem.totalprice,
            paymentStatus: "Pending",
            orderStatus: "Pending"
          }));
    

        const addorder = new Order({
            orderId: newOrderId,
            user: user_id,
            products: productsData,
            address: [
              {
                fullname: SelectedAddress.fullname, 
                mobile: SelectedAddress.mobile,
                address: SelectedAddress.address,
                locality: SelectedAddress.locality,
                zipcode: SelectedAddress.zipcode,
                city: SelectedAddress.city,
                state:SelectedAddress.state,
              },
              // Add more addresses if needed
            ],
            paymentMethod: "cash", 
            orderDate: orderDate ,
            orderTime: new Timestamp(), 
            deliveryDate: new Date(orderDate.setDate(orderDate.getDate() + 7)),
            amount: totalamount,
          });
          
          // Save the new order to the database
         const saveincart= addorder.save()
            .then((result) => {
              console.log("Order added successfully:",);
              // Handle success
            })
       
        };
  

        const deletecart= await Cart.deleteOne({user:user_id})
    
  
        res.render('verifypeyment', { user: user_id });
} catch (error) {
      console.log(error.message);
    }
}

module.exports={
    getcheckout,
    loadcheckout,
    verifypayment,
    

}