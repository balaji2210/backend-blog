const { errorHandler } = require("../utility/helper");
const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports.isAuthenticated = async (req, res, next) => {
  const token =
    req?.cookies?.token ||
    req?.header("Authorization")?.replace("Bearer ", "") ||
    req.header["x-access-token"];

  if (!token) {
    return errorHandler(res, "Access Denied", 401);
  }

  const decoded = jwt.verify(token, process.env.SECRET);

  req.user = await userSchema.findById(decoded?._id).select("-password");
  next();
};
