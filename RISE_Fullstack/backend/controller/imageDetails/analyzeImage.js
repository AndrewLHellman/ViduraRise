const { update, find_all } = require("../../database_services/mongo_crud");
const { toB64padded } = require("../../common_func");
const crypto = require("crypto");
require("dotenv").config();
const buffertrim = require("buffertrim");
const axios = require("axios");

const analyzeImage = async (req, res) => {
  try {
    const { filename, uniqueId, storage } = req.body;
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

    let sto_file = filename + "#" + storage;
    var bufCmdB64padded = toB64padded(sto_file, 16);
    var ciphertextB64 = cipher.update(bufCmdB64padded, "", "base64");
    ciphertextB64 += cipher.final("base64");
    console.log("ciphertext is storage: ", ciphertextB64);

    // url = "http://172.31.26.111:8085/cntSegmentation";
    url = "http://localhost:5050/cntSegmentation";
    const postData = {
      sto_file: ciphertextB64,
    };
    api_res = await axios.post(url, postData);
    console.log(api_res.data);
    analysisData = api_res.data;

    if (analysisData.status == 1) {
      var bufCmdB64padded = Buffer.concat([
        // Base64 decoding of ciphertext, decryption
        decipher.update(analysisData.data, "base64"),
        decipher.final(),
      ]);
      var bufCmdB64 = buffertrim.trimEnd(bufCmdB64padded); // Unpadding (unreliable)
      var bufCmd = Buffer.from(bufCmdB64.toString("utf8"), "base64"); // Base64 decoding
      var res_data = bufCmd.toString("utf8").replace(/'/g, '"');

      let analysisresult = JSON.parse(res_data);
      let update_data = {
        edgeCoverage: analysisresult.edgeCov,
        OrientationLoss: analysisresult.oriLoss,
        averageThickness: analysisresult.avgThic,
        averageSeparation: analysisresult.avgSep,
        distanceEntropy: analysisresult.disEntr,
        contrast: analysisresult.contrast,
        focus: analysisresult.focus,
        zoom: analysisresult.zoom,
        status: "Yes",
      };

      let query_params = {
        modelName: "imageMetaData",
        where: { uniqueId: uniqueId },
        updateData: update_data,
      };

      let data = await update(query_params);
      console.log("----Update Data----", data);
      proj_id = data.uniqueId;

      let query = {
        modelName: "imageMetaData",
        where: { projectId: data.projectId, status: "Yes" },
      };
      let projet_data = await find_all(query);
      let update_proj_data = {
        modelName: "projectData",
        where: { uniqueId: data.projectId },
        updateData: { imageAnalyzed: projet_data.length },
      };
      console.log(update_proj_data)
      let pdata = await update(update_proj_data);
      console.log("-->> ", pdata);

      return res.json({
        status: 1,
        msgType: "success",
        msg: "Image Analyzed Successfully!",
        data: update_data,
      });
    } else {
      return res.json({
        status: 0,
        msgType: "fail",
        msg: "Something went wrong, try later!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: 0,
      msgType: "error",
      msg: `Error message: ${error.toString()}`,
    });
  }
};

module.exports = { analyzeImage };
