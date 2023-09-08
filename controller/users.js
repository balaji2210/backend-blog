const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const joi = require("joi");

const userSchema = require("../models/user");

const blogSchema = require("../models/blogs");

const {
  catchHandler,
  errorHandler,
  responseHandler,
} = require("../utility/helper");

module.exports.signUp = async (req, res) => {
  try {
    const schema = joi.object().keys({
      name: joi.string().required(),
      password: joi.string().required(),
      email: joi.string().required(),
    });

    await schema.validateAsync(req.body);

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await userSchema.create({
      name,
      password: hashedPassword,
      email,
    });

    if (!user) {
      return errorHandler(res, "Error SigningUp", 400);
    }

    return responseHandler(res, "User Signup", {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
    });
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.signIn = async (req, res) => {
  try {
    const schema = joi.object().keys({
      email: joi.string().required(),
      password: joi.string().required(),
    });

    await schema.validateAsync(req.body);

    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });

    if (!user) {
      return errorHandler(res, "No User Found", 400);
    }

    const passwordMatch = await bcrypt.compare(password, user?.password);

    if (!passwordMatch) {
      return errorHandler(res, "Wrong Email Or Password", 401);
    }

    const token = jwt.sign(
      {
        _id: user?._id,
        email: user?.email,
        userType: user?.userType,
      },
      process.env.SECRET,
      {
        expiresIn: "3d",
      }
    );

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV === "production" ? true : false,
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    return responseHandler(res, "User Login", {
      success: true,
      token,
    });
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.getUserData = async (req, res) => {
  try {
    const user = await userSchema.findById(req.user._id).select("-password");

    if (!user) {
      return errorHandler(res, "No User Found", 400);
    }
    return responseHandler(res, "User Data", user);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.logOut = async (req, res) => {
  try {
    res.clearCookie();
    return responseHandler(res, "Logout", { success: true });
  } catch (error) {
    return catchHandler(res, req, error);
  }
};
