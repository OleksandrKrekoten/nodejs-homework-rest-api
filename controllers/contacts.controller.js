const {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../models/contacts");
const createError = require("http-errors");

const getContacts = async (req, res, next) => {
  const { _id } = req.user;
  const contact = await getAllContacts(_id);
  res.status(200).json({
    status: "success",
    code: 200,
    contact,
  });
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    return next(createError(404, "Not found"));
  }
  return res.status(200).json({
    status: "success",
    code: 200,
    contact,
  });
};

const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const userId = req.user._id;
  await addContact({ name, email, phone }, userId);

  res.status(201).json({
    status: "success",
    code: 201,
  });
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    return next(createError(404, "Not found"));
  }
  await removeContact(contactId);
  return res.status(200).json({
    status: "success",
    code: 200,
    message: "contact deleted",
  });
};

const changeContact = async (req, res, next) => {
  console.log("changeContact");
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const body = req.body;
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    return next(createError(404, "Not found"));
  }

  updateContact(contactId, body, userId);
  return res.status(200).json({
    status: "success",
    code: 200,
  });
};

const updateStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const body = req.body;
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    return next(createError(400, "Contact not found"));
  }
  await updateStatusContact(contactId, body, userId);
  console.log("updateStatusContact");
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
  updateStatus,
};
