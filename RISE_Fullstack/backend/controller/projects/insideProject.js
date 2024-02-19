const { find_raw, find_all } = require("../../database_services/mongo_crud");

const getAllProjectimages= async (req, res) => {
  try {
    let { projectId } = req.body;
    
    let query_params = {
      modelName: "imageMetaData",
      where: {projectId: projectId}
    };

    const all_data = await find_all(query_params);

    return res.json({
      status: 1,
      msgType: "success",
      data: all_data,
      length: all_data.length
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

module.exports = { getAllProjectimages };
