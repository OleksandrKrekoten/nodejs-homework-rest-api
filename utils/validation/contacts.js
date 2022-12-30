const Joi = require("joi");
const addContactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(9).max(16).required(),
});
module.exports = {
  addContactSchema,
};
