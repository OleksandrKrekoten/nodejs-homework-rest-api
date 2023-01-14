const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../models/contacts");
const { HttpError } = require("../utils/httpError/contacts");

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
    return next(HttpError(404, "Not found"));
  }
  return res.status(200).json({
    status: "success",
    code: 200,
    contact,
  });
};

const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;

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
    return next(HttpError(404, "Not found"));
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
  const contact = await getContactById(contactId);
  if (!contact) {
    return next(HttpError(404, "Not found"));
  }

  updateContact(contactId, body);
  return res.status(200).json({
    status: "success",
    code: 200,
  });
};
const updateStatus = async (req, res, next)=>{
  const { contactId } = req.params;
  const body = req.body;
  const contact = await getContactById(contactId);
   if (!contact) {
     return next(HttpError(400, "Not found"));
  }
  updateStatusContact(contactId, body);
  return res.status(200).json({
    status: "success",
    code: 200,
  });
}
module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  changeContact,
  updateStatus,
};
