const Jimp = require("jimp");
const { s3 } = require("../../common_func");
const { insertquery } = require("../../database_services/mongo_crud")

const showImage = async (req, res) => {
  try {
    console.log("----req.body---- ", req.body);
    let { filepath, filename } = req.body;
    // await in_data()
    await getImage(filepath, filename)
      .then((img) => {
        console.log(img);
        let image =
          "<img src='data:image/png;base64," + encode(img.Body) + "'" + "/>";
        let startHTML = "<html><body>";
        let endHTML = "</body></html>";
        let html = startHTML + image + endHTML;
        console.log("----req.body---- ", req.body);
        return res.json({
          status: 1,
          msgType: "success",
          data: html,
        });
      })
      .catch((e) => {
        return res.json({
          status: 0,
          msgType: "error",
          msg: `Error message: ${e.toString()}`,
        });
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

const encode = async (data) => {
  let buf = Buffer.from(data);
  console.log("--->>>   ", buf);
  Jimp.read(buf, (err, res) => {
    if (err) throw new Error(err);
    res.quality(100).write("resized.jpg");
  });
  let base64 = buf.toString("base64");
  return base64;
};

const getImage = async (filepath, filename) => {
  const data = s3
    .getObject({
      Bucket: filepath,
      Key: filename,
    })
    .promise();
  console.log(data);
  return data;
};

module.exports = { showImage };
