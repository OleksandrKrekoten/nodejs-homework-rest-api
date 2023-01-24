const jwt = require("jsonwebtoken");
const { HttpError } = require("../utils/httpError/contacts");
const { User } = require("../schema/usersMongooseSchema");

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
    throw HttpError(401, "token type is not valid");
  }

  if (!token) {
    throw HttpError(401, "no token provided");
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
      throw HttpError(401, "jwt token is not valid");
    }
    throw error;
  }

  next();
}

module.exports = {
  validateBody,
  auth,
};
