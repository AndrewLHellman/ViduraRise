const { find_all } = require("../../database_services/mongo_crud");

const getinstruments = async (req, res) => {
  try {

    let {user_email} = req.body;

    let query_params = {
      modelName: "instrumentData",
      where: {
        usersAssigned: {
          $elemMatch: { user_email: user_email }
        }
      }
    };
    let data = await find_all(query_params);
    //console.log("----->> ", data);

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
