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
      const productPrice = await Product.findById(product_id);
      if (existingProduct) {
        // If the product exists, increment its count
        existingProduct.count += 1;

        // Calculate the total price for the product (you may get the product price from your database)
        // Assuming you have a Product model
        existingProduct.totalprice = existingProduct.count * productPrice.price;

        // Update the product's stock in the database
        const product = await Product.findById(product_id);
        if (product) {
          product.stock -= 1; // Adjust the stock as needed
          await product.save();
        }

        await existingUser.save();
      } else {
        // If the product doesn't exist, add it to the cart
        existingUser.products.push({ product: product_id, count });

        // Calculate the total price for the new product
        const productPrice = await Product.findById(product_id); // Assuming you have a Product model
        existingUser.products[existingUser.products.length - 1].totalprice =
          productPrice.price;

        // Update the product's stock in the database
        const product = await Product.findById(product_id);
        if (product) {
          product.stock -= 1; // Adjust the stock as needed
          await product.save();
        }

        await existingUser.save();
      }
    } else {
      // Create a new cart and add the product
      const productPrice = await Product.findById(product_id);
      const totalprice = productPrice.price * count;
      const newCart = new Cart({
        user: user_id,
        products: [{ product: product_id, count, totalprice }],
        createdAt: Date.now(),
      });

      // Calculate the total price for the new product

      // Update the product's stock in the database
      const product = await Product.findById(product_id);
      if (product) {
        product.stock -= 1; // Adjust the stock as needed
        await product.save();
      }

      await newCart.save();
    }
    let totalValue = 0;

    for (const product of existingUser.products) {
      totalValue += product.totalprice;
    }
    const ammount = await Cart.updateOne(
      { user: user_id },
      { $set: { ammount: totalValue } }
    );
    if (ammount) {
      res.redirect("/home");

    }

  } catch (error) {
    console.log(error.message);
  }
};




const actionincart = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const product_id = req.body.product_id;
    const count = req.body.count;
    console.log(user_id);
    console.log(count);
    console.log(product_id);
    const existingUser = await Cart.findOne({ user: user_id });

    if (existingUser) {
      // Check if the product already exists in the cart
      const existingProduct = existingUser.products.find(
        (item) => item.product.toString() === product_id
      );

      var stockupadate = 0;

      if (existingProduct) {
        const productPrice = await Product.findById(product_id); // Assuming you have a Product model
        existingProduct.totalprice = count * productPrice.price;
        // If the product exists, increment its count
        if (existingProduct.count > count) {
          stockupadate++;
        } else {
          stockupadate--;
        }

        existingProduct.count = count;
        existingProduct.createdAt = Date.now();

        await existingUser.save();
      }
      let totalValue = 0;

      for (const product of existingUser.products) {
        totalValue += product.totalprice;
      }
      const ammount = await Cart.updateOne(
        { user: user_id },
        { $set: { ammount: totalValue } }
      );
    }
    const product = await Product.findById(product_id);
    if (product) {
      product.stock += stockupadate; // Adjust the stock as needed
      await product.save();
    }
    res.redirect("/cart");
  } catch (error) {
    console.log(error.message);
  }
};




const deletefromcart = async (req, res) => {
  try {
    const id = req.query.id; // Assuming id is passed as a query parameter
    const count=req.query.count
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
      await product.save();}


      let totalValue = 0;

      for (const product of existingUser.products) {
        totalValue += product.totalprice;
      }
      const ammount = await Cart.updateOne(
        { user: user_id },
        { $set: { ammount: totalValue } }
      );

    res.redirect("/cart");
  } catch (error) {
    console.error(error.message);
    // Handle the error, perhaps by sending an error response to the client.
    res
      .status(500)
      .json({
        error: "An error occurred while deleting the product from the cart.",
      });
  }
};

module.exports = {
  addtocart,
  actionincart,
  deletefromcart,
};
