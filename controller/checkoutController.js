const Cart = require("../model/cartModel");
const Product = require("../model/productsModel");
const Address = require("../model/addressModel");
const Order = require("../model/orderModel");
const User = require("../model/userModel");
const { Timestamp } = require("mongodb");
const { response } = require("../routes/userRoute");
const Razorpay = require("razorpay");
const Crypto = require("crypto");

function hmac_sha256(data, secret) {
  const hmac = Crypto.createHmac("sha256", secret);
  hmac.update(data);
  return hmac.digest("hex");
}
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
var instance = new Razorpay({
  key_id: "rzp_test_X95zcCjqK3bbAQ",
  key_secret: "WHrgT4zUIFZEkYq97HfNQTO6",
});

function generateOrderId() {
  // Generate a random identifier (6 characters)
  const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();

  return randomId;
}

// Server-side code (Node.js)
const loadcheckout = async (req, res) => {
  try {
    const user_id = req.session.user_id;

    // Use populate to retrieve product details along with cart data
    const cartData = await Cart.findOne({ user: user_id }).populate(
      "products.product"
    );

    if (cartData && cartData.products.length !== 0) {
      // Check stock availability for each product in the cart
      const outOfStockProducts = cartData.products.filter((item) => {
        const product = item.product;
        return product.stock <= 0 || item.count > product.stock;
      });

      if (outOfStockProducts.length === 0) {
        // Send a JSON response indicating that the cart has items and all products are in stock
        return res.json({ cartItem: true });
      } else {
        // Send a JSON response indicating that some products are out of stock
        return res.json({
          outOfStock: true,
          outOfStockProducts: outOfStockProducts,
        });
      }
    } else {
      // Send a JSON response indicating that the cart is empty
      return res.json({ cartEmpty: true });
    }
  } catch (error) {
    console.error(error);
    // Render an error page with a message if an error occurs during checkout
    return res.render("error", {
      message: "An error occurred during checkout.",
    });
  }
};const getcheckout = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const address =
      (await Address.findOne({ user: user_id }).sort({ _id: -1 })) || 0;
    const cartData = await Cart.findOne({ user: user_id }).populate(
      "products.product"
    );

    // Calculate total amount directly in the function
    let totalAmount = 0;

    cartData.products.forEach((product) => {
      const productPrice = product.product.discountprice==null? product.product.price:product.product.discountprice; // Assuming your product model has a 'price' field
      const productCount = product.count;
      totalAmount += productPrice * productCount;
    });

    console.log(totalAmount);

    res.render("checkout", {
      user: user_id,
      address: address.address,
      cart: cartData,
      totalAmount: totalAmount,
    });
  } catch (error) {
    console.log(error);
  }
};


const verifycheckout = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const cartData = await Cart.findOne({ user: user_id }).populate(
      "products.product"
    );

    if (cartData && cartData.products.length !== 0) {
      // Check stock availability for each product in the cart
      const outOfStockProducts = cartData.products.filter((item) => {
        const product = item.product;
        return product.stock < 0 || item.count > product.stock;
      });

      if (outOfStockProducts.length !== 0) {
        console.log(1000);
        return res.json({
          outOfStock: true,
          outOfStockProducts: outOfStockProducts,
        });
      } else {
        response.redirect("/verify-payment");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const verifypayment = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const addressId = req.body.selectedAddress;
    const paymentType = req.body.paymentType;

    const userData = await User.findById(user_id);

    let totalamount = 0;

    const cartData = await Cart.findOne({ user: user_id }).populate(
      "products.product"
    );

    if (cartData && cartData.products.length !== 0) {
      // Check stock availability for each product in the cart
      const outOfStockProducts = cartData.products.filter((item) => {
        const product = item.product;
        return product.stock < 0 || item.count > product.stock;
      });

      if (outOfStockProducts.length !== 0) {
        console.log(1000);
        return res.json({ outOfStock: true });
      } else {
        const userAddresses = await Address.findOne({ user: user_id });

        // Find the selected address
        const selectedAddress = userAddresses.address.find(
          (addr) => addr._id.toString() === addressId.toString()
        );

        // Calculate the total amount based on the prices of products in the cart
        for (const price of cartData.products) {
          totalamount += price.product.discountprice==null? price.product.price:price.product.discountprice * price.count;
        }
        const orderDate = new Date();
        const newOrderId = generateOrderId();
        var deliveryDate = new Date(orderDate);
deliveryDate.setDate(orderDate.getDate() + 7);

        // Create an array of product data for the order
        const productsData = cartData.products.map((productItem) => ({
          product: productItem.product,
          count: productItem.count,
          totalprice:productItem.product.discountprice==null? productItem.product.price: productItem.product.discountprice * productItem.count,
          paymentStatus: "Pending",
          orderStatus: "Pending",
        }));

        // Create a new order instance
        const addorder = new Order({
          orderId: newOrderId,
          user: user_id,
          products: productsData,
          address: [
            {
              fullname: selectedAddress.fullname,
              mobile: selectedAddress.mobile,
              address: selectedAddress.address,
              locality: selectedAddress.locality,
              zipcode: selectedAddress.zipcode,
              city: selectedAddress.city,
              state: selectedAddress.state,
            },
          ],
          paymentMethod: "pending",
          orderDate: orderDate,
          orderTime: new Timestamp(),
          deliveryDate:deliveryDate,
          amount: totalamount,
        });

        // Save the new order to the database
        await addorder.save();

        if (paymentType === "COD") {
          for (const product of cartData.products) {
            const updateStock = await Product.updateMany(
              { _id: product.product },
              { $inc: { stock: -product.count } } // Assuming you want to decrement the stock
            );
          }
          
          await Cart.deleteOne({ user: user_id });

          return res.json({ cod: true, newOrderId: newOrderId });
        } else if (paymentType === "OnlinePayment") {
          const amount = totalamount * 100;
          const options = {
            amount: amount,
            currency: "INR",
            receipt: "" + newOrderId,
          };

          instance.orders.create(options, (err, order) => {
            if (!err) {
              res.status(200).json({
                online: true,

                order_id: order.id,
                amount: amount,
                key_id: "rzp_test_X95zcCjqK3bbAQ",
                receipt: options.receipt,
                contact: userData.mobile,
                name: userData.firstname,
                email: userData.email,
              });
            } else {
              res
                .status(400)
                .send({ success: false, msg: "Something went wrong!" });
            }
          });
        }

        // Delete the user's cart after processing the order
      }
    }
  } catch (error) {
    console.error(error.message);
    // Handle the error (e.g., display an error page or send an error response)
    res.status(500).render("error", {
      message: "An error occurred during payment verification.",
    });
  }
};

const verifyonlinepayment = async (req, res) => {
  try {
    const razorpay_signature = req.body.response.razorpay_signature;
    const order_id = req.body.response.razorpay_order_id;
    const razorpay_payment_id = req.body.response.razorpay_payment_id;
    const secret = "WHrgT4zUIFZEkYq97HfNQTO6";
    const newOrderId = req.body.data.receipt;

    console.log(req.body);
    const user_id = req.session.user_id;
    generated_signature = hmac_sha256(
      order_id + "|" + razorpay_payment_id,
      secret
    );
    console.log(generated_signature);
    if (generated_signature == razorpay_signature) {
      await Cart.deleteOne({ user: user_id });
      const orderData = await Order.findOne({ orderId: newOrderId });
      const updateData = await Order.updateOne(
        { orderId: newOrderId },
        {
          $set: {
            paymentMethod: "online",
            "products.$[].paymentStatus": "success",
          },
        }
      );

      console.log(orderData);
      if (orderData) {
      }

      console.log("payment is successful");
      return res.json({ online: true, newOrderId: newOrderId });
    } else {
      console.log("Payment verification failed");
    }
  } catch (error) {
    console.log(error.message, "dfadsfds");
  }
};

const paymentsuccess = async (req, res) => {
  try {
    const user_id = req.session.user_id;

    const id = req.query.id;

    const orderData = await Order.find({ orderId: id });

    if (orderData) {
      res.render("verifypeyment", { user: user_id });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getcheckout,
  loadcheckout,
  verifypayment,
  verifycheckout,
  verifyonlinepayment,
  paymentsuccess,
};
