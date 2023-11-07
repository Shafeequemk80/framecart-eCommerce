const Cart = require("../model/cartModel");
const Product = require("../model/productsModel");
const addtocart = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const product_id = req.query.id;
    const count = 1; // Set the initial count to 1 or adjust it as needed

    const existingUser = await Cart.findOne({ user: user_id });

    if (existingUser) {
      // Check if the product already exists in the cart
      const existingProduct = existingUser.products.find(
        (item) => item.product.toString() === product_id
      );

      if (existingProduct) {
        // If the product exists, increment its count
        existingProduct.count += 1;
        await existingUser.save();
      } else {
        // If the product doesn't exist, add it to the cart
        existingUser.products.push({ product: product_id, count });
        await existingUser.save();
      }
    } else {
      // Create a new cart and add the product
      const newCart = new Cart({
        user: user_id,
        products: [{ product: product_id, count }],
        createdAt: Date.now(),
      });
      await newCart.save();
    }

    res.redirect("/home");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  addtocart,
};
