const { getImage, encode, convertTiffToPng } = require("../../common_func");

const showImage = async (req, res) => {
  try {
    let { storage, filename } = req.body;
    const imgdata = await getImage(storage, filename)
    let base64_img = await encode(imgdata.Body)
    let base64PngData = await convertTiffToPng(base64_img);

    return res.json({
      status: 1,
      msgType: "success",
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


module.exports = { showImage };
