const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const schema = Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, "field is required"],
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
    },
    phone: {
      type: Number,
      required: [true, "field is required"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);
const Contact = mongoose.model("contacts", schema);
module.exports = {
  Contact,
};
