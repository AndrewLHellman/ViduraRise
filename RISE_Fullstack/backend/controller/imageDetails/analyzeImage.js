const { update, find_all } = require("../../database_services/mongo_crud");
const { getImage, encode, convertTiffToPng } = require("../../common_func");
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require("axios");

const analyzeImage = async (req, res) => {
  try {
    const { filename, uniqueId, storage } = req.body;

    // Get the image from S3
    const imgdata = await getImage(storage, filename);
    const base64_img = await encode(imgdata.Body);

    // Create a temp file to store the image
    const tempDir = path.join(__dirname, '../../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(tempDir, filename);
    fs.writeFileSync(tempFilePath, imgdata.Body);

    // Create form data with the image file
    const formData = new FormData();
    formData.append('file', fs.createReadStream(tempFilePath));

    // Call the SEGAPI.py service
    const segApiUrl = 'http://localhost:5001/api/process'; // Using port from FLASK_PORT_SEGMENT env variable
    try {
      console.log("Calling SEGAPI at:", segApiUrl);
      const segApiResponse = await axios.post(segApiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      console.log("SEGAPI Response:", segApiResponse.data);

      // Clean up the temp file
      fs.unlinkSync(tempFilePath);

      if (segApiResponse.data) {
        // Map the SEGAPI response to our existing format
        const segApiData = segApiResponse.data;

        let update_data = {
          edgeCoverage: "0.8612", // Sample value until properly implemented
          OrientationLoss: segApiData.loss_pred_orient ? segApiData.loss_pred_orient.toFixed(6) : 0, // This is from SEGAPI
          averageThickness: "0.5621", // Sample value until properly implemented
          averageSeparation: "0.7341", // Sample value until properly implemented
          distanceEntropy: "0.4321", // Sample value until properly implemented
          contrast: 0.75, // Default values required for UI
          focus: 0.85,  
          zoom: 0.9,
          status: "Yes",
        };

        let query_params = {
          modelName: "imageMetaData",
          where: { uniqueId: uniqueId },
          updateData: update_data,
        };

        let data = await update(query_params);
        console.log("----Update Data----", data);

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

        let pdata = await update(update_proj_data);
        console.log("Project update result:", pdata);

        return res.json({
          status: 1,
          msgType: "success",
          msg: "Image Analyzed Successfully with SEGAPI!",
          data: update_data,
        });
      } else {
        return res.json({
          status: 0,
          msgType: "fail",
          msg: "SEGAPI returned no data",
        });
      }
    } catch (segError) {
      console.log("SEGAPI Error:", segError);
      // Clean up the temp file if it exists
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }

      return res.json({
        status: 0,
        msgType: "fail",
        msg: `SEGAPI Error: ${segError.message}`,
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
