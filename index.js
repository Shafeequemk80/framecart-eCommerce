const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/frmecart");
const app = express();
const path = require("path");
require('dotenv').config();
const user_route = require("./routes/userRoute");
const admin_route = require("./routes/adminRoute");
const bodyparser=require("body-parser");
const nocache = require("nocache");
app.use(nocache());

app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json());
 

app.set("view engine", "ejs");
app.set("views","./views/users");

app.use("/static", express.static("./public"));

app.use("/", user_route); 

app.use("/admin", admin_route);
const PORT =  3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
  console.log(`http://localhost:${PORT}/home`);
  console.log(`http://localhost:${PORT}/admin`);
});
