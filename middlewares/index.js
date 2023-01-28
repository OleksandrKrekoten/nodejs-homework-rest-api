const multer = require("multer");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { User } = require("../schema/usersMongooseSchema");
const path = require("path");
function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.message,
      });
    }
    return next();
  };
}
async function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    throw createError(401, "token type is not valid");
  }

  if (!token) {
    throw createError(401, "no token provided");
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    req.token = token;
    req.user = user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw createError(401, "jwt token is not valid");
    }
    throw error;
  }

  next();
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../tmp"));
  },
  filename: function (req, file, cd) {
    cd(null, Math.random() + file.originalname);
  },
});
const upload = multer({
  storage,
});
module.exports = {
  validateBody,
  auth,
  upload,
};
