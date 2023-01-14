const mongoose = require("mongoose");
// const { isEmail, isMobilePhone } = require("validator");
const schema = mongoose.Schema(
  {
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
  { versionKey: false, timeStamps: true }
);
const Contact = mongoose.model("contacts", schema);
module.exports = {
  Contact,
};
