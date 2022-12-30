const express = require("express");
const {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  changeContact,
} = require("../../controllers/contacts.controller");
const { validateBody } = require("../../middlewares");
const { addContactSchema } = require("../../utils/validation/contacts");
const router = express.Router();

router.get("/", async (req, res, next) => {
  res.send();
});

router.get("/api/contacts", getContacts);

router.get("/api/contacts/:contactId", getContact);

router.post("/api/contacts", validateBody(addContactSchema), createContact);

router.delete("/api/contacts/:contactId", deleteContact);

router.put(
  "/api/contacts/:contactId",
  validateBody(addContactSchema),
  changeContact
);

module.exports = router;
