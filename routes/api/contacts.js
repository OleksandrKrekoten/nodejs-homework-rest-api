const express = require("express");
const {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  changeContact,
} = require("../../controllers/contacts.controller");
const router = express.Router();

router.get("/", async (req, res, next) => {
  res.send();
});

router.get("/api/contacts", getContacts);

router.get("/api/contacts/:contactId", getContact);

router.post("/api/contacts", createContact);

router.delete("/api/contacts/:contactId", deleteContact);

router.put("/api/contacts/:contactId", changeContact);

module.exports = router;
