require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

//routes
const userRoutes = require("./routes/user.routes");
const blogRoutes = require("./routes/blogs.routes");
const { DB } = require("./config/db");
const cloudinary = require("cloudinary").v2;

const fileUpload = require("express-fileupload");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.json({ limit: "100mb", extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("tiny"));
app.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

DB();

mongoose.set("debug", true);

app.use("/", userRoutes);
app.use("/blog", blogRoutes);

app.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`);
});
