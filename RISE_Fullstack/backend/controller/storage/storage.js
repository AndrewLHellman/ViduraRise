const { s3 } = require("../../common_func");
const { find_all } = require("../../database_services/mongo_crud");

const getStorage = async (req, res) => {
  try {

    let {user_email} = req.body;

    let query_params = {
      modelName: "storage_data",
      where: {
        usersAssigned: {
          $elemMatch: { user_email: user_email }
        }
      }
    };
    
    let in_data = await find_all(query_params);

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
