const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

mongoose.pluralize(null);

const instrument_data_schema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      default: nanoid(7),
      index: { unique: true },
    },
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: "N/A", // off, Operational, Standby, Hibernate, Initializing, ClosingDown, Error
    },
    unit: {
      type: String,
    },
    IPaddress: {
      type: String,
    },
    gateway: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("instrumentData", instrument_data_schema);
