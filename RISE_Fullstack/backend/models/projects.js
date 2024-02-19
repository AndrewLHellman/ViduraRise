const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
mongoose.pluralize(null);

const project_data_schema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      default: nanoid(7),
      index: { unique: true },
    },
    type: {
      type: String,
      default: "N/A",
    },
    description: {
      type: String,
    },
    projectName: {
      type: String,
      required: true,
    },
    instruments: [
      {
        in_name: String,
      },
    ],
    imageAnalyzed: {
      type: Number,
      default: 0
    },
    imageScanned: {
      type: Number,
      default: 0
    },
    storageAssign: [
      {
        st_name: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("projectData", project_data_schema);
