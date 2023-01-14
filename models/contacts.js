const { Contact } = require("../utils/validation/mongooseSchema");

const listContacts = async () => {
  const db = await Contact.find({});
  return db;
};

const getContactById = async (contactId) => {
  const updatedDb = Contact.findById(contactId);
  return updatedDb;
};

const removeContact = async (contactId) => {
  await Contact.findByIdAndRemove(contactId);
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const contact = await Contact.create({ name, email, phone });
  return contact;
};

const updateContact = async (contactId, body) => {
  await Contact.updateOne({ _id: { $eq: contactId } }, { ...body });
};
const updateStatusContact = async (contactId, body) => {
  await Contact.updateOne({ _id: { $eq: contactId } }, { ...body });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
