const User = require("../model/userModel");
const Products = require("../model/productsModel");
const Wishlist = require("../model/wishlistModel");

const addtowishlist = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const productId = req.body.id;

    const existinguser = await Wishlist.findOne({ user: user_id });
      
    if (existinguser) {
      const existingproduct = existinguser.products.find(
        (product) => product.product.toString() === productId
      );
     
      if (existingproduct) {
      
       res.status(200).json({ existingproduct: true });
       
      } else {
        const pushnewproduct = existinguser.products.push({
          product: productId,
          createdAt: new Date(),
        });

        await existinguser.save();
        res.status(200).json({ success: true });
      }
    } else {
      const newwishlist = new Wishlist({
        user: user_id,
        products: [
          {
            product: productId,
            createdAt: new Date(),
          },
        ],
      });

      const added = await newwishlist.save();
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getwishlist = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const userData = await User.findById(user_id);
    const wishlistData = await Wishlist.findOne({ user: user_id }).populate("products.product")

   
    res.render("wishlist", { user: userData,wishlistData:wishlistData });
  } catch (error) {
    console.log(error.message);
  }
};
const deletefromwishlist = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const productId = req.query.id;
    console.log(productId);

    const wishlistData = await Wishlist.findOne({ user: user_id });

    if (wishlistData) {
      const existingProductIndex = wishlistData.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingProductIndex !== -1) {
       
        wishlistData.products.splice(existingProductIndex, 1);

       
        await wishlistData.save();
        res.status(200).json({ success: true});
        
      } else {
        res.status(404).json({ success: false, message: 'Product not found in wishlist' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Wishlist not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = {
  addtowishlist,
  getwishlist,
  deletefromwishlist,
};
