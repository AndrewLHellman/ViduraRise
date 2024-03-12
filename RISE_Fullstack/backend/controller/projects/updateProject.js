const { update } = require("../../database_services/mongo_crud");

const updateProject = async (req, res) => {
  try {
    let { uniqueId, type, description, projectName, storageAssign, instruments } = req.body;

    let query_params = {
      modelName: "projectData",
      where: { uniqueId: uniqueId },
      updateData: {
        type: type,
        description: description,
        projectName: projectName,
        storageAssign: storageAssign.map((storage) => ({ "st_name": storage})),
        instruments: instruments,
      },
      query_type: "updateOne",
    };

    update_return = await update(query_params);

    return res.json({
      status: 1,
      msgType: "success",
      data: update_return,
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

module.exports = { updateProject };
