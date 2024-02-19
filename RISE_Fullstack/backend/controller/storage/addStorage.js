const { insertquery, find_one } = require("../../database_services/mongo_crud");

const addStorage = async (req, res) => {
    try {
        let {
            bucketName,
            type
        } = req.body;

        console.log("requested data-->>", req.body);

        var data = {
            bucketName: bucketName,
            type: type,
            usage: "0MB",
            imagecount: 0,
        };

        let query_params = {
            modelName: "storage_data",
            where: { bucketName: bucketName },
        };

        check_storage = await find_one(query_params);

        if (check_storage == null) {
            query_params = {
                modelName: "storage_data",
                data: data
            };
            await insertquery(query_params);
            return res.json({
                status: 1,
                msgType: "success",
                msg: "Storage Added!",
                data: data,
            });
        } else {
            return res.json({
                status: 2,
                msgType: "success",
                msg: "Storage already exists!",
            });
        }
    } catch (error) {
        console.log(error);
        return res.json({
            status: 0,
            msgType: "error",
            msg: `Error message: ${error.toString()}`,
        });
    }
}

module.exports = { addStorage }