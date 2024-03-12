const { find_all } = require("../../database_services/mongo_crud");

const getAllProjects = async (req, res) => {
  try {

    let {user_email} = req.body;

    let query_params = {
      modelName: "projectData",
      where: {
        usersAssigned: {
          $elemMatch: { user_email: user_email }
        }
      }
    };

    all_projects = await find_all(query_params);

    project_data = [];
    for (let i = 0; i < all_projects.length; i++) {
      temp_obj = {};
      temp_obj["uniqueId"] = all_projects[i]["uniqueId"];
      temp_obj["type"] = all_projects[i]["type"];
      temp_obj["description"] = all_projects[i]["description"];
      temp_obj["projectName"] = all_projects[i]["projectName"];
      temp_obj["instruments"] = all_projects[i]["instruments"];
      temp_obj["imageAnalyzed"] = all_projects[i]["imageAnalyzed"];
      temp_obj["storageAssign"] = all_projects[i]["storageAssign"];
      temp_obj["usersAssigned"] = all_projects[i]["usersAssigned"];
      project_data.push(temp_obj);
    }

    return res.json({
      status: 1,
      msgType: "success",
      data: project_data,
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

module.exports = { getAllProjects };
