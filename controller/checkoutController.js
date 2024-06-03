const Cart = require("../model/cartModel");
const Product = require("../model/productsModel");
const Address = require("../model/addressModel");
const Wallet = require("../model/walletModel");
const Order = require("../model/orderModel");
const User = require("../model/userModel");
const { Timestamp } = require("mongodb");
const Razorpay = require("razorpay");
const Crypto = require("crypto");

function hmac_sha256(data, secret) {
  const hmac = Crypto.createHmac("sha256", secret);
  hmac.update(data);
  return hmac.digest("hex");
}
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

var instance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
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
    res.render("500");
  }
};
const getcheckout = async (req, res) => {
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
      const productPrice =
        product.product.discountprice == null
          ? product.product.price
          : product.product.discountprice; // Assuming your product model has a 'price' field
      const productCount = product.count;
      totalAmount += productPrice * productCount;
    });

    res.render("checkout", {
      user: user_id,
      address: address.address,
      cart: cartData,
      totalAmount: totalAmount,
      pageName:"Checkout"
    });
  } catch (error) {
    res.render("500");
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
        return res.json({
          outOfStock: true,
          outOfStockProducts: outOfStockProducts,
        });
      } else {
        response.redirect("/verify-payment");
      }
    }
  } catch (error) {
    res.render("500");
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
        return res.json({ outOfStock: true });
      } else {
        const userAddresses = await Address.findOne({ user: user_id });

        // Find the selected address
        const selectedAddress = userAddresses.address.find(
          (addr) => addr._id.toString() === addressId.toString()
        );

        // Calculate the total amount based on the prices of products in the cart
        for (const price of cartData.products) {
          totalamount +=
            price.product.discountprice == null
              ? price.product.price * price.count
              : price.product.discountprice * price.count;
        }

        const orderDate = new Date();
        const newOrderId = generateOrderId();
        var deliveryDate = new Date(orderDate);
        deliveryDate.setDate(orderDate.getDate() + 7);

        // Create an array of product data for the order
        const productsData = cartData.products.map((productItem) => ({
          product: productItem.product,
          count: productItem.count,
          totalprice:
            productItem.product.discountprice == null
              ? productItem.product.price * productItem.count
              : productItem.product.discountprice * productItem.count,
          paymentStatus: "Pending",
          orderStatus: "Pending",
        }));

        // Create a new order instance
        const addorder = new Order({
          orderId: newOrderId,
          user: user_id,
          products: productsData,
          address: {
            fullname: selectedAddress.fullname,
            mobile: selectedAddress.mobile,
            address: selectedAddress.address,
            locality: selectedAddress.locality,
            zipcode: selectedAddress.zipcode,
            city: selectedAddress.city,
            state: selectedAddress.state,
          },

          paymentMethod: "pending",
          orderDate: orderDate,
          orderTime: new Timestamp(),
          deliveryDate: deliveryDate,
          amount: totalamount,
        });

        // Save the new order to the database
        await addorder.save();

        if (paymentType === "COD") {
          const orderData = await Order.findOne({ orderId: newOrderId });
          orderData.paymentMethod = "Cash on Delivery";
          orderData.save();

          for (const product of orderData.products) {
            const updateStock = await Product.updateMany(
              { _id: product.product },
              { $inc: { stock: -product.count } } // Assuming you want to decrement the stock
            );
          }

          await Cart.updateOne({ user: user_id }, { $set: { products: [] } });

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
                key_id: RAZORPAY_ID_KEY,
                receipt: options.receipt,
                contact: selectedAddress.mobile,
                name: userData.firstname,
                email: userData.email,
              });
            } else {
              res
                .status(400)
                .send({ success: false, msg: "Something went wrong!" });
            }
          });
        } else if (paymentType === "Wallet") {
          const checkwallet = await Wallet.findOne({ user: user_id });
          const orderData = await Order.findOne({ orderId: newOrderId });

          if (checkwallet.totalAmount < orderData.amount) {
            res.json({ infuentbalance: true });
          } else {
            if (!orderData) {
              // Handle the case where the order data is not found
              return res.status(404).json({ error: "Order not found" });
            }

            const updateData = await Order.updateOne(
              { orderId: newOrderId },
              {
                $set: {
                  paymentMethod: "Wallet",
                  "products.$[].paymentStatus": "success",
                },
              }
            );

            const walletUpdate = await Wallet.updateOne(
              { user: user_id },
              {
                $inc: { totalAmount: -orderData.amount },
                $push: {
                  walletHistory: {
                    transactionId: newOrderId,
                    transactionDate: new Date(),
                    transactionDetails: "Debit",
                    transactionType: "Purchase",
                    transactionAmount: orderData.amount,
                  },
                },
              }
            );

            for (const product of orderData.products) {
              const updateStock = await Product.updateMany(
                { _id: product.product },
                { $inc: { stock: -product.count } } // Assuming you want to decrement the stock
              );
            }

            const updateCart = await Cart.updateOne(
              { user: user_id },
              { $set: { products: [] } }
            );

            if (
              updateCart &&
              updateData.modifiedCount > 0 &&
              walletUpdate.modifiedCount > 0
            ) {
              return res.json({ Wallet: true, newOrderId: newOrderId });
            } else {
              // Handle the case where one of the updates failed
              return res
                .status(500)
                .json({ error: "Failed to update one or more records" });
            }
          }
        }
        // Delete the user's cart after processing the order
      }
    }
  } catch (error) {
    res.render("500");
  }
};

const verifyonlinepayment = async (req, res) => {
  try {
    const razorpay_signature = req.body.response.razorpay_signature;
    const order_id = req.body.response.razorpay_order_id;
    const razorpay_payment_id = req.body.response.razorpay_payment_id;
    const secret = RAZORPAY_SECRET_KEY;
    const newOrderId = req.body.data.receipt;

    const user_id = req.session.user_id;
    generated_signature = hmac_sha256(
      order_id + "|" + razorpay_payment_id,
      secret
    );

    if (generated_signature == razorpay_signature) {
      await Cart.updateOne({ user: user_id }, { $set: { products: [] } });

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
      for (const product of orderData.products) {
        const updateStock = await Product.updateMany(
          { _id: product.product },
          { $inc: { stock: -product.count } } // Assuming you want to decrement the stock
        );
      }

      if (orderData) {
      }

      return res.json({ online: true, newOrderId: newOrderId });
    } else {
    }
  } catch (error) {
    res.render("500");
  }
};

const paymentsuccess = async (req, res) => {
  try {
    const user_id = req.session.user_id;

    const id = req.query.id;

    const orderData = await Order.find({ orderId: id });

    if (orderData) {
      res.render("verifypeyment", { user: user_id,pageName:"404" });
    }
  } catch (error) {
    res.render("500");
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
