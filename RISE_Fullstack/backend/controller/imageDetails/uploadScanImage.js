const {
  insertquery,
  find_one,
  update,
} = require("../../database_services/mongo_crud");
const { s3 } = require("../../common_func");
const sharp = require("sharp");

const uploadScanimage = async (req, res) => {
  try {
    let { projectId, storage, instrument } = req.body;
    // console.log("--->>>  ", req.body);
    console.log("--->>>  ", req.file);

    const fileBuffer = req.file.buffer;
    const imageSize = fileBuffer.length;
    const imageType = req.file.mimetype;
    let size = (imageSize / (1024 * 1024)).toFixed(2);
    const params = {
      Bucket: storage,
      Key: req.file.originalname,
      Body: fileBuffer,
    };

    await s3.upload(params).promise();
    const dimensions = await sharp(fileBuffer).metadata();
    const resolution = `${dimensions.width} x ${dimensions.height}`;
    const imageData = {
      projectId: projectId,
      storage: storage,
      instrument: instrument,
      size: size.toString() + " MB",
      filename: req.file.originalname,
      fileType: imageType,
      filepath: storage + "/" + req.file.originalname,
      resolution: resolution,
      status: "No",
    };

    const storage_params = await find_one({
      modelName: "storage_data",
      where: { bucketName: storage },
    });

    let curr_usage = storage_params["usage"].split(" ")[0];
    let updated_usage =((parseFloat(curr_usage) + parseFloat(size)).toFixed(2)).toString() + " MB";

    const up_params = {
      modelName: "storage_data",
      where: { bucketName: storage },
      updateData: {usage: updated_usage, imagecount: storage_params["imagecount"]+1},
      queryType: "updateOne",
    };
    await update(up_params);

    const query_params = { modelName: "imageMetaData", data: imageData };
    in_data = await insertquery(query_params);
    // console.log(in_data);
    return res.json({
      status: 1,
      msgType: "success",
      data: in_data,
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

module.exports = { uploadScanimage };
