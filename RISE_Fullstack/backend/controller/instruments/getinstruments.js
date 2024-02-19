const { find_all } = require("../../database_services/mongo_crud");

const getinstruments = async (req, res) => {
  try {
    let query_params = {
      modelName: "instrumentData",
    };
    let data = await find_all(query_params);
    // console.log("----->> ", data);

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

module.exports = { getinstruments };
