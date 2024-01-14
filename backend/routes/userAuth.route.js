const express = require("express");

const router = express.Router();
const userAuthController = require("../controllers/userAuthController");

router.post("/signin", userAuthController.login);
router.post("/signup", userAuthController.signup);
router.post("/externalLogin", userAuthController.externalLogin);

module.exports = router;
