const mongoose = require("mongoose");

module.exports.DB = () =>
  mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log("DB CONNECTED");
    })
    .catch((error) => {
      console.log(`: ${error}`);
    });
