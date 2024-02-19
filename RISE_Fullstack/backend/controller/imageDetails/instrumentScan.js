const {
  find_one,
  update,
  insertquery,
} = require("../../database_services/mongo_crud");
const { toB64padded, getImage, encode, convertTiffToPng } = require("../../common_func");
const buffertrim = require("buffertrim");
const axios = require("axios");
const sharp = require("sharp");
const crypto = require("crypto");
require("dotenv").config();

const instrumentScan = async (req, res) => {
  try {
    let { projectId, instrument, storage, zoom, focus, contrast } = req.body;
    var cipher = crypto.createCipheriv(
      process.env.ALGORITHM,
      process.env.SECURITYKEY,
      process.env.INITVECTOR
    );
    cipher.setAutoPadding(false);

    var decipher = crypto.createDecipheriv(
      process.env.ALGORITHM,
      process.env.SECURITYKEY,
      process.env.INITVECTOR
    );
    decipher.setAutoPadding(false);

    var data = {
      zoom: zoom,
      focus: focus,
      contrast: contrast,
      storage: storage,
      projectId: projectId,
    };
    data = JSON.stringify(data);

    var bufCmdB64padded = toB64padded(data, 16);
    var ciphertextB64 = cipher.update(bufCmdB64padded, "", "base64");
    ciphertextB64 += cipher.final("base64");
    // console.log("Encrypted ciphertext is ", ciphertextB64);

    url = "http://localhost:5050/ppiApi";
    const postData = {
      data: ciphertextB64,
    };

    api_res = await axios.post(url, postData);
    if (api_res.data.status == 1) {
      var imageData = api_res.data.img_name;
      var bufCmdB64padded = Buffer.concat([
        decipher.update(imageData, "base64"),
        decipher.final(),
      ]);
      var bufCmdB64 = buffertrim.trimEnd(bufCmdB64padded); // Unpadding (unreliable)
      var bufCmd = Buffer.from(bufCmdB64.toString("utf8"), "base64"); // Base64 decoding
      var img_name = bufCmd.toString("utf8");

      var imgdata = await getImage(storage, img_name);
      const data_size = (imgdata.ContentLength / (1024 * 1024)).toFixed(2);
      const filetype = imgdata.ContentType;
      const dimensions = await sharp(imgdata.Body).metadata();
      const resolution = `${dimensions.width} x ${dimensions.height}`;

      // console.log('===>>',imgdata)

      const insertimageData = {
        projectId: projectId,
        storage: storage,
        instrument: instrument,
        size: data_size.toString() + " MB",
        filename: img_name,
        fileType: filetype,
        filepath: storage + "/" + img_name,
        resolution: resolution,
        status: "No",
      };

      const storage_params = await find_one({
        modelName: "storage_data",
        where: { bucketName: storage },
      });

      let curr_usage = storage_params["usage"].split(" ")[0];
      let updated_usage =
        (parseFloat(curr_usage) + parseFloat(data_size)).toFixed(2).toString() +
        " MB";

      const up_params = {
        modelName: "storage_data",
        where: { bucketName: storage },
        updateData: {
          usage: updated_usage,
          imagecount: storage_params["imagecount"] + 1,
        },
        queryType: "updateOne",
      };
      await update(up_params);

      const query_params = {
        modelName: "imageMetaData",
        data: insertimageData,
      };
      in_data = await insertquery(query_params);
      console.log("--->>>>uniqueId", in_data)
    }
    let base64tiffdata = await encode(imgdata.Body);
    let base64PngData = await convertTiffToPng(base64tiffdata);

    return res.json({
      status: 1,
      msgType: "success",
      filename: img_name,
      uniqueId :in_data.uniqueId,
      data: base64PngData,
      
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

module.exports = { instrumentScan };
