const Cart = require("../model/cartModel");
const Product = require("../model/productsModel");


const addtocart = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const product_id = req.body.id;
    const count = 1; // Set the initial count to 1 or adjust it as needed

    const existingUser = await Cart.findOne({ user: user_id });

    let totalValue = 0;

    if (existingUser) {
      const existingProduct = existingUser.products.find(
        (item) => item.product.toString() === product_id
      );

      const productPrice = await Product.findById(product_id);
      const totalprice = productPrice.price;

      if (existingProduct) {
        existingProduct.count += 1;
        existingProduct.totalprice += totalprice;
      } else {
        existingUser.products.push({
          product: product_id,
          count: 1,
          totalprice,
        });
      }

      await existingUser.save();

      for (const product of existingUser.products) {
        totalValue = product.totalprice;
       
      }

      const amount = await Cart.updateOne(
        { user: user_id },
        { $set: { ammount: totalValue } }
      );

      console.log(amount);

    } else {
      const productPrice = await Product.findById(product_id);
      const totalprice = productPrice.price;

      const newCart = new Cart({
        user: user_id,
        products: [{ product: product_id, count, totalprice }],
        createdAt: Date.now(),
        ammount: totalprice,
      });

      await newCart.save();
    }

    res.status(200).json({ message: 'Added to cart successfully' });

  } catch (error) {
    console.error(error.stack || error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const actionincart = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const product_id = req.body.product_id;
    const count = req.body.count; 
    const existingUser = await Cart.findOne({ user: user_id });
console.log(count,"das");
    if (existingUser) {
      const existingProduct = existingUser.products.find(
        (item) => item.product.toString() === product_id
      );

      let stockUpdate = 0;

      if (existingProduct) {
        
        const productPrice = await Product.findById(product_id);
        existingProduct.totalprice = count * productPrice.price;

        // Directly update stock based on the new count
        stockUpdate = count - existingProduct.count;
        existingProduct.count = count;
        existingProduct.createdAt = Date.now();

        await existingUser.save();
        
      }

      let totalValue = 0;

      for (const product of existingUser.products) {
        totalValue += product.totalprice;
      }

      await Cart.updateOne(
        { user: user_id },
        { $set: { ammount: totalValue } }
      );

      const product = await Product.findById(product_id);

      if (product) {
        // Directly update the stock based on the stockUpdate value
        product.stock += stockUpdate;
        await product.save();
      }

      // Check if existingProduct is defined before accessing its properties
      if (existingProduct) {

        res.status(200).json({
          count: existingProduct.count,
          amount: existingProduct.totalprice,
          message: 'Cart updated successfully',
        });
      
      } else {
       
        res.status(404).json({ error: 'Product not found in the cart' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }

  } catch (error) {
    console.error(error.stack || error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const deletefromcart = async (req, res) => {
  try {
    const id = req.query.id; // Assuming id is passed as a query parameter
    const count = req.query.count;
    const user_id = req.session.user_id; // Assuming user_id is stored in the session
    const existingUser = await Cart.findOne({ user: user_id });

    if (existingUser) {
      // Check if the product already exists in the cart
      const existingProductIndex = existingUser.products.findIndex(
        (item) => item.product.toString() === id
      );

      if (existingProductIndex !== -1) {
        // Remove the product from the cart
        existingUser.products.splice(existingProductIndex, 1);

        // Save the updated cart
        await existingUser.save();

        console.log("Product deleted from the cart.");
      }
    }
    const product = await Product.findById(id);
    if (product) {
      product.stock += parseInt(count);
      // Adjust the stock as needed
      await product.save();
    }

    let totalValue = 0;

    for (const product of existingUser.products) {
      totalValue += product.totalprice;
    }
    const ammount = await Cart.updateOne(
      { user: user_id },
      { $set: { ammount: totalValue} }
    );

    res.redirect("/cart");
  } catch (error) {
    console.error(error.message);
    // Handle the error, perhaps by sending an error response to the client.
    res.status(500).json({
      error: "An error occurred while deleting the product from the cart.",
    });
  }
};

module.exports = {
  addtocart,
  actionincart,
  deletefromcart,
};
