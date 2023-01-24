const express = require("express");
const {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  changeContact,
  updateStatus,
} = require("../../controllers/contacts.controller");
const { validateBody, auth } = require("../../middlewares");
const { tryCatchWrapper } = require("../../utils/tryCatchWrapper");
const { addContactSchema } = require("../../utils/validation/contacts");
const router = express.Router();

router.get("/", tryCatchWrapper(auth), tryCatchWrapper(getContacts));

router.get(
  "/api/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(getContacts)
);

router.get(
  "/api/contacts/:contactId",
  tryCatchWrapper(auth),
  tryCatchWrapper(getContact)
);

router.post(
  "/api/contacts",
  validateBody(addContactSchema),
  tryCatchWrapper(auth),
  tryCatchWrapper(createContact)
);

router.delete(
  "/api/contacts/:contactId",
  tryCatchWrapper(auth),
  tryCatchWrapper(deleteContact)
);

router.put(
  "/api/contacts/:contactId",
  validateBody(addContactSchema),
  tryCatchWrapper(auth),
  tryCatchWrapper(changeContact)
);
router.patch(
  "/api/contacts/:contactId/favorite",
  tryCatchWrapper(auth),
  tryCatchWrapper(updateStatus)
);

module.exports = router;
