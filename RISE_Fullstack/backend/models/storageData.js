const mongoose = require("mongoose");
mongoose.pluralize(null);

const storage_data_schema = new mongoose.Schema(
  {
    bucketName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "S3"
    },
    usage: {
      type: String
    },
    imagecount: {
      type: Number
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("storage_data", storage_data_schema);
