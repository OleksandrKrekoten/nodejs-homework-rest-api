const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactPath = path.join(__dirname, "contacts.json");

async function readDb() {
  const dbRaw = await fs.readFile(contactPath, "utf-8");
  const db = JSON.parse(dbRaw);
  return db;
}
async function writeDb(db) {
  await fs.writeFile(contactPath, JSON.stringify(db, null, 2));
}
const listContacts = async () => {
  const db = await readDb();
  return db;
};

const getContactById = async (contactId) => {
  const db = await readDb();
  const updatedDb = db.find((contact) => contact.id === contactId);
  return updatedDb || null;
};

const removeContact = async (contactId) => {
  const db = await readDb();
  const updatedDb = db.filter((contact) => contact.id !== contactId);
  await writeDb(updatedDb);
  return updatedDb;
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const id = nanoid();
  const db = await readDb();
  const newContact = { id, name, email, phone };
  db.push(newContact);
  await writeDb(db);
};

const updateContact = async (contactId, body) => {
  const db = await readDb();
  const { name, email, phone } = body;
  db.forEach((contact) => {
    if (contact.id === contactId) {
      contact.name = name;
      contact.email = email;
      contact.phone = phone;
    }
  });
  await writeDb(db);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
