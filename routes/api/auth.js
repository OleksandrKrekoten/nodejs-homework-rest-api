const express = require("express");
const {
  register,
  login,
  uploadImage,
} = require("../../controllers/auth.controller");
const { auth, upload } = require("../../middlewares");
const { tryCatchWrapper } = require("../../utils/tryCatchWrapper");
const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.patch(
  "/:userId/image",
  upload.single("image"),
  tryCatchWrapper(auth),
  uploadImage
);
module.exports = authRouter;
