
require('dotenv').config();
const express = require("express");
const morgan = require('morgan')

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/frmecart");
const app = express();
const path = require("path");
const moment = require('moment');

const user_route = require("./routes/userRoute");
const admin_route = require("./routes/adminRoute");
const bodyparser=require("body-parser");
const nocache = require("nocache");
app.use(nocache());

app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json());


app.set("view engine", "ejs");
app.set("views","./views/users");

app.use("/static", express.static(path.join(__dirname, 'public')));

app.use("/", user_route); 

app.use(morgan('dev'));

app.use("/admin", admin_route);
const PORT = process.env.PORT || 3000
console.log(process.env.PORT);
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
  console.log(`http://localhost:${PORT}/home`);
  console.log(`http://localhost:${PORT}/admin`);
});
