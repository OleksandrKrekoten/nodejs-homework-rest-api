const { User } = require("../schema/usersMongooseSchema");
const { HttpError } = require("../utils/httpError/contacts");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = bcrypt.hash(password, salt);
  const storedUser = await User.findOne({ email });
  if (storedUser) {
    return next(HttpError(409, "Email in use"));
  }
  try {
    const savedUser = await User.create({
      email,
      password: await hashedPassword,
    });
    res.status(201).json({
      data: {
        user: email,
        id: savedUser._id,
      },
    });
  } catch (error) {
    next(HttpError(error.status, error.message));
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  const storedUser = await User.findOne({ email });
  if (!storedUser) {
    return next(HttpError(401, "email or password is not valid"));
  }
  const isPasswordValid = await bcrypt.compare(password, storedUser.password);
  if (!isPasswordValid) {
    return next(HttpError(401, "email or password is not valid"));
  }
  const token = jwt.sign({ id: storedUser._id }, process.env.JWT_SECRET, {
    expiresIn: "10h",
  });
  return res.json({
    token,
  });
};
module.exports = {
  register,
  login,
};
