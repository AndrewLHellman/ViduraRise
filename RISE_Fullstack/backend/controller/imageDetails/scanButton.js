const { find_one } = require("../../database_services/mongo_crud");

const scanButton = async (req, res) => {
  try {
    let { projectId } = req.body;
    query_params = {
      modelName: "projectData",
      where: { uniqueId: projectId },
    };
    find_data = await find_one(query_params);
    // console.log(query_params, find_data);

    const resultObject = {
      instrument: [],
      storage: [],
    };
    
    // Loop through the 'instruments' array and add 'in_name' values to the 'instrument' property
    if (find_data.instruments && Array.isArray(find_data.instruments)) {
      find_data.instruments.forEach((instrument) => {
        if (instrument.in_name) {
          resultObject.instrument.push(instrument.in_name);
        }
      });
    }
    
    // Loop through the 'storageAssign' array and add 'st_name' values to the 'storage' property
    if (find_data.storageAssign && Array.isArray(find_data.storageAssign)) {
      find_data.storageAssign.forEach((storage) => {
        if (storage.st_name) {
          resultObject.storage.push(storage.st_name);
        }
      });
    }
    
    // console.log(resultObject);

    return res.json({
      status: 1,
      msgType: "success",
      data: resultObject,
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

module.exports = { scanButton };
