const mongoose = require("mongoose");
mongoose.pluralize(null);
const user_data_schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    inputZip: {
      type: String,
      required: true,
    },
    inputCountry: {
      type: String,
      required: true,
    },
    admin_status:{
      type: Number,
      default: 0, // 0:user, 1:requested for admin, 2:admin
      required: true,
    },
    password: {
      type: String,
      required: false
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("user_data", user_data_schema);
