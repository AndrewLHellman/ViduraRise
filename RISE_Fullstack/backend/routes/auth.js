const router = require("express").Router();

const { signUpData }  = require('../controller/auth/register')
const { authenticateUser } = require('../controller/auth/login')
const { logoutUser } = require('../controller/auth/logout');
const { generate_token, verify_token } = require("../controller/auth/AuthToken");

router.post("/register", signUpData);
router.post("/login", authenticateUser);
router.get("/logout", logoutUser);
router.post("/token", generate_token)
router.post("/verify-token", verify_token)


module.exports = router;
