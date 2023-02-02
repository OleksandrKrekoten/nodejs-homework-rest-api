const { User } = require("../schema/usersMongooseSchema");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const createError = require("http-errors");
const { BadRequest } = require("http-errors");
const { sendMail } = require("../utils/sendMail");
const { v4 } = require("uuid");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = bcrypt.hash(password, salt);
  const storedUser = await User.findOne({ email });
  if (storedUser) {
    return next(createError(409, "Email in use"));
  }
  try {
    const verificationToken = v4();
    const avatar = gravatar.url(email, { s: "100", r: "x", d: "retro" });
    const savedUser = await User.create({
      email,
      password: await hashedPassword,
      avatar,
      verificationToken,
    });
    await sendMail({
      to: email,
      subject: "Pleace confirm your email",
      html: `<a href="localhost:${process.env.PORT}/api/auth/verify/${verificationToken}">Confirm your email</a>`,
    });
    res.status(201).json({
      user: email,
      id: savedUser._id,
    });
  } catch (error) {
    next(createError(error.status || 409, error.message));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const storedUser = await User.findOne({ email });
  if (!storedUser) {
    return next(createError(401, "email or password is not valid"));
  }
  if (!storedUser.verify) {
    return next(createError(401, "email is not verify"));
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
const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({
      verificationToken,
    });
    if (!user) {
      throw BadRequest("Verify token is not valid");
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    return res.json({
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
};
const reconfirmEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user.verify) {
      throw BadRequest("Verification has already been passed");
    }
    if (user) {
      await sendMail({
        to: email,
        subject: "Pleace confirm your email",
        html: `<a href="localhost:${process.env.PORT}/api/auth/verify/${user.verificationToken}">Confirm your email</a>`,
      });
      res.status(201).json({
        message: "Verification email sent",
      });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = {
  register,
  login,
  uploadImage,
  verifyEmail,
  reconfirmEmail,
};
