const { Contact } = require("../schema/contactsMongooseSchema");

const getAllContacts = async (userId) => {
  const db = await Contact.find({ userId });

  return db;
};

const getContactById = async (contactId, userId) => {
  const updatedDb = Contact.findOne({ _id: contactId, userId });
  return updatedDb;
};

const removeContact = async (contactId, userId) => {
  await Contact.findOneAndRemove(contactId, userId);
};

const addContact = async (body, userId) => {
  const { name, email, phone } = body;
  const contact = await Contact.create({ name, email, phone, userId });
  return contact;
};

const updateContact = async (contactId, body, userId) => {
  await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    { $set: { ...body } }
  );
};
const updateStatusContact = async (contactId, body, userId) => {
  await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    { $set: { ...body } }
  );
};

module.exports = {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
