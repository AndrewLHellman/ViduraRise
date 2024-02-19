const { deleteQuery, update } = require("../../database_services/mongo_crud");
const { s3 } = require("../../common_func");

const deleteImage = async (req, res) => {
  try {
    let { _id, filename, storage } = req.body;

    let query_params = {
      modelName: "imageMetaData",
      condition: { _id: _id },
      query_type: "deleteOne",
    };

    delete_return = await deleteQuery(query_params);

    var params = {
      Bucket: storage,
      Key: filename,
    };

    s3.deleteObject({ Bucket: storage, Key: filename}, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log("Image deleted from S3! ");
        delete_return["S3 deletion"] = "success";
      }
    });

    s3.listObjectsV2({ Bucket: storage}, (err, data) => {
      if (err) {
        console.error("Error listing objects:", err);
      } else {
        let totalSizeBytes = 0;
        let img_count = 0;

        data.Contents.forEach((object) => {
          img_count += 1;
          totalSizeBytes += object.Size;
        });

        let totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
        totalSizeMB = totalSizeMB.toString() + " MB";

        let query_params = {
          modelName: "storage_data",
          where: { bucketName: storage },
          updateData: { imagecount: img_count, usage: totalSizeMB },
        };

        update(query_params);
      }
    });

    return res.json({
      status: 1,
      msgType: "success",
      data: delete_return,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: 0,
      msgType: "error",
      msg: `Error message: ${error.toString()}`,
    });
  }
};

module.exports = { deleteImage };
