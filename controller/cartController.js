const Cart = require("../model/cartModel");
const Product = require("../model/productsModel");

const addtocart = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const product_id = req.body.id;
    const count = 1; // Set the initial count to 1 or adjust it as needed

    const existingUser = await Cart.findOne({ user: user_id });
    
    const product = await Product.findById(product_id);
    if (existingUser) {
      const existingProduct = existingUser.products.find(
        (item) => item.product.toString() === product_id
      )


      if (existingProduct ) {
        if (product.stock > existingProduct.count && existingProduct.count < 10) {
        existingProduct.count += 1;
         
        res.status(200).json({ message:true});
        }
       else{
        res.status(200).json({ message: false });
       }
      } else {
        if (product.stock>1) {
          console.log(132);
        existingUser.products.push({
          product: product_id,
          count: 1,
        });
        res.status(200).json({ message:true});
      }else {
        res.status(200).json({ message: false });
      }
      
      }

      await existingUser.save();
    } else {
      if (product.stock>1) {
      const newCart = new Cart({
        user: user_id,
        products: [{ product: product_id, count }],
        createdAt: Date.now(),
      });

      await newCart.save();
      console.log(152);
      res.status(200).json({ message:true});
    }else{
      res.status(200).json({ message: false });
    }
    
  }
   
  
  } catch (error) {
    console.error(error.stack || error.message);
    res.status(200).json({ message: false });
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const actionincart = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const product_id = req.body.product_id;
    const count = req.body.count;
    const existingUser = await Cart.findOne({ user: user_id });
  
    if (existingUser) { 
      const existingProduct = existingUser.products.find(
        (item) => item.product.toString() === product_id
      );
      const product = await Product.findById(product_id);
      if (existingProduct &&count <= product.stock &&count <= 10 ) {
        // Directly update stock based on the new count
        existingProduct.count = count>product.stock?product.stock:count;
        existingProduct.createdAt = Date.now();

        await existingUser.save();
      

    
          
     
        const updatedAmount = product.discountprice ?? product.price;
        const totalAmount = updatedAmount * existingProduct.count;
        
        res.status(200).json({
          count: existingProduct.count,
          amount: totalAmount,
          message: "Cart updated successfully",
        });
        
      } else {
        res.status(404).json({ error: "Product not found in the cart" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error.stack || error.message);
    res.status(500).json({ error: "Internal Server Error" });
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
