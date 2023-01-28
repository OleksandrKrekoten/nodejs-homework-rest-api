const { User } = require("../schema/usersMongooseSchema");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const createError = require("http-errors");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = bcrypt.hash(password, salt);
  const storedUser = await User.findOne({ email });
  if (storedUser) {
    return next(createError(409, "Email in use"));
  }
  try {
    const avatar = gravatar.url(email, { s: "100", r: "x", d: "retro" });
    const savedUser = await User.create({
      email,
      password: await hashedPassword,
      avatar,
    });
    res.status(201).json({
      user: email,
      id: savedUser._id,
    });
  } catch (error) {
    next(createError(error.status, error.message));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const storedUser = await User.findOne({ email });
  if (!storedUser) {
    return next(createError(401, "email or password is not valid"));
  }
  const isPasswordValid = await bcrypt.compare(password, storedUser.password);
  if (!isPasswordValid) {
    return next(createError(401, "email or password is not valid"));
  }
  const token = jwt.sign({ id: storedUser._id }, process.env.JWT_SECRET, {
    expiresIn: "10h",
  });
  return res.json({
    token,
  });
};

const uploadImage = async (req, res, next) => {
  const { filename } = req.file;
  const tmpPath = path.resolve(__dirname, "../tmp", filename);
  const publicPath = path.resolve(__dirname, "../public/avatar", filename);
  try {
    await fs.rename(tmpPath, publicPath);
  } catch (error) {
    await fs.unlink(tmpPath);
    throw error;
  }
  const { _id } = req.user;
  const imagePath = `/public/avatar/${filename}`;
  const user = await User.findByIdAndUpdate(
    _id,
    {
      avatar: imagePath,
    },
    { new: true }
  );
  return res.json({
    avatar: user.avatar,
  });
};
module.exports = {
  register,
  login,
  uploadImage,
};
