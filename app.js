const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts.js");
const authRouter = require("./routes/api/auth.js");



const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/", contactsRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);
app.use("/public", express.static("public"));


app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((error, req, res, next) => {
  console.error("Handling errors: ", error.message, error.name);


  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: error.message,
    });
  }


  if (error.message.includes("Cast to ObjectId failed for value")) {
    return res.status(400).json({
      message: "id is invalid",
    });
  }

  if (error.status) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
});

module.exports = app;
