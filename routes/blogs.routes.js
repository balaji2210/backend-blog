const { postBlog, getBlogs } = require("../controller/blogs");
const { isAuthenticated } = require("../middlewares/user");

const router = require("express").Router();

router.post("/create", isAuthenticated, postBlog);

router.get("/", getBlogs);

module.exports = router;
