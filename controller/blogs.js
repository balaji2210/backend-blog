const joi = require("joi");

const blogSchema = require("../models/blogs");
const {
  responseHandler,
  catchHandler,
  errorHandler,
} = require("../utility/helper");
const cloudinary = require("cloudinary").v2;

module.exports.postBlog = async (req, res) => {
  try {
    const schema = joi.object().keys({
      title: joi.string().required(),
      description: joi.string().required(),
    });

    await schema.validateAsync(req.body);

    const { title, description } = req.body;

    const userId = req.user._id;
    let result;

    if (req.files) {
      result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "blogs",
      });
    }

    const blog = await blogSchema.create({
      user_id: userId,
      title,
      description,
      image: {
        public_id: result?.public_id,
        secure_url: result?.secure_url,
      },
    });

    return responseHandler(res, "Blog Created", blog);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.getBlogs = async (req, res) => {
  try {
    const blogs = await blogSchema.find();

    if (!blogs?.length) {
      return errorHandler(res, "No Blogs Found", 400);
    }

    return responseHandler(res, "Blogs", blogs);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};
