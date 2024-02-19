const {
  insertquery,
  find_all,
  update,
} = require("../../database_services/mongo_crud");
const { s3 } = require("../../common_func");
const sharp = require("sharp");

const projectDetails = async (req, res) => {
  try {
    let data = {
      $push: {
        instruments: { in_name: "EMC SEM-3" },
        storageAssign: { st_name: "mitochondria-project-1" },
      },
    };
    let query_params = {
      modelName: "projectData",
      where: { uniqueId: "g2lMSs2" },
      updateData: data,
      queryType: "updateOne",
    };
    const in_ret = await update(query_params);
    console.log("----->> ", data);
    return res.json({
      status: 1,
      msgType: "success",
      data: in_ret,
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

const image_data = async (req, res) => {
  try {
    const params = {
      Bucket: "mitochondria-project-1",
    };

    s3.listObjectsV2(params, async (err, data) => {
      if (err) {
        console.error("Error listing objects:", err);
        return res
          .status(500)
          .json({ status: 0, msgType: "error", msg: "Error listing objects" });
      }
      const resolutionsPromises = data.Contents.map(async (object) => {
        const resolution = await getImageResolution(params.Bucket, object.Key);
        const size = (object.Size / (1024 * 1024)).toFixed(2);
        const fname_type = object.Key.split(".");
        const each_image = {
          projectId: "g2lMSs2",
          storage: params.Bucket,
          instrument: "EMC SEM-3",
          size: size.toString() + " MB",
          filename: object.Key,
          fileType: fname_type[1],
          filepath: params.Bucket + "/" + object.Key,
          resolution: resolution,
        };

        return each_image;
      });

      try {
        const allImageData = await Promise.all(resolutionsPromises);

        for (let i = 0; i < allImageData.length; i++) {
          const query_params = {
            modelName: "imageMetaData",
            data: allImageData[i],
          };

          re = insertquery(query_params);
        }

        return res.json({
          status: 1,
          msgType: "success",
          data: allImageData,
        });
      } catch (error) {
        console.error("Error processing image data:", error);
        return res.status(500).json({
          status: 0,
          msgType: "error",
          msg: "Error processing image data",
        });
      }
    });
  } catch (error) {
    return res.json({
      status: 0,
      msgType: "error",
      msg: `Error message: ${error.toString()}`,
    });
  }
};

const getImageResolution = async (bucket, filename) => {
  try {
    const data = await s3
      .getObject({ Bucket: bucket, Key: filename })
      .promise();
    const metadata = await sharp(data.Body).metadata();
    resolution = `${metadata.width} x ${metadata.height}`;
    console.log(resolution, bucket, filename);
    return resolution;
  } catch (error) {
    console.error("Error retrieving image or reading metadata:", error);
    return null;
  }
};

module.exports = { projectDetails, image_data, getImageResolution };
