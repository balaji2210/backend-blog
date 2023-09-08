const { signUp, signIn, getUserData, logOut } = require("../controller/users");
const { isAuthenticated } = require("../middlewares/user");

const router = require("express").Router();

router.post("/signup", signUp);

router.post("/login", signIn);

router.get("/user", isAuthenticated, getUserData);

router.get("/logout", logOut);

module.exports = router;
