const { update } = require("../../database_services/mongo_crud");

const updateInstruments = async (req, res) => {
  try {
    
    let {_id, name, description} = req.body;
    
    let query_params = {
      modelName: "instrumentData",
      where : {_id: _id},
      updateData: { name : name, description : description}
    };

    let data = await update(query_params);
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

module.exports = { updateInstruments };
