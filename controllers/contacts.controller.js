const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../models/contacts");

const Joi = require("joi");
const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(9).max(16).required(),
});

const getContacts = async (req, res, next) => {
  const contact = await listContacts();
  res.status(200).json({
    status: "success",
    code: 200,
    contact,
  });
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    return res.status(404).json({
      code: 404,
      message: "Not found",
    });
  }
  return res.status(200).json({
    status: "success",
    code: 200,
    contact,
  });
};

const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
    });
  }
  await addContact({ name, email, phone });

  res.status(201).json({
    status: "success",
    code: 201,
  });
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    return res.status(404).json({
      code: 404,
      message: "Not found",
    });
  }
  await removeContact(contactId);
  return res.status(200).json({
    status: "success",
    code: 200,
    message: "contact deleted",
  });
};

const changeContact = async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;
  const { error } = schema.validate(body);
  if (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
    });
  }
  const contact = await getContactById(contactId);
  if (!contact) {
    return res.status(404).json({
      code: 404,
      message: "Not found",
    });
  }

  updateContact(contactId, body);
  return res.status(200).json({
    status: "success",
    code: 200,
  });
};
module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  changeContact,
};
