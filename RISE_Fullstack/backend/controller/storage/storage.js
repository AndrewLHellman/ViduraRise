const { s3 } = require("../../common_func");
const { find_all } = require("../../database_services/mongo_crud");

const getStorage = async (req, res) => {
  try {
    
    param = {
      modelName: "storage_data",
    };
    in_data = await find_all(param);

    //console.log(in_data);
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

module.exports = { getStorage };
