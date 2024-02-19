const { find_all } = require("../../database_services/mongo_crud");

const imagedetails = async (req, res) => {
  try {
    let { filepath } = req.body;
    let query_params = {
      modelName: "imageMetaData",
      where: { filepath: filepath },
    };
    let data = await find_all(query_params);
    console.log("----->> ", data )
    return res.json({
      status: 1,
      msgType: "success",
      data: data,
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

module.exports = { imagedetails };
