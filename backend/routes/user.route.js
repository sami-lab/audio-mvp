const express = require("express");
const authenticationMiddleware = require("../middlewares/authentication");
const authorizationMiddleware = require("../middlewares/authorization");

const router = express.Router();
const userController = require("../controllers/userController");

router.get(
  "/",
  [authenticationMiddleware, authorizationMiddleware],
  userController.getAllUsers
);
router.get("/me", authenticationMiddleware, userController.getMyUser);
//router.post('/normalUser', userController.createUser);
router.post(
  "/admin",
  [authenticationMiddleware, authorizationMiddleware],
  userController.createAdmin
);
router.patch("/updateMe", authenticationMiddleware, userController.updateUser);
router.delete("/me", authenticationMiddleware, userController.deleteUser);
router.delete(
  "/:id",
  [authenticationMiddleware, authorizationMiddleware],
  userController.deleteUser
);
module.exports = router;
