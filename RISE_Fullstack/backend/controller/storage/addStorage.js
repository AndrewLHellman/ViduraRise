const { insertquery, find_one, update } = require("../../database_services/mongo_crud");

const addStorage = async (req, res) => {
    try {
        let {
            bucketName,
            type,
            user_email
        } = req.body;

        console.log("requested data-->>", req.body);

        var data = {
            bucketName: bucketName,
            type: type,
            usage: "0MB",
            imagecount: 0,
            usersAssigned:[{ user_email: user_email }]
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
        } else if (check_storage.usersAssigned.some(user => user.user_email === user_email)) {
            console.log("Storage already exists and user is already assigned");
            return res.json({
                status: 2,
                msgType: "success",
                msg: "Storage already exists and user is already assigned",
            })
        }
        else {
            check_storage.usersAssigned.push({ user_email: user_email });
            console.log("Adding user to storage");
            query_params = {
                modelName: "storage_data",
                where: { bucketName: bucketName },
                updateData: { usersAssigned: check_storage.usersAssigned },
                queryType: "updateOne"
            };
            await update(query_params);
            return res.json({
                status: 3,
                msgType: "success",
                msg: "User added to existing storage!",
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