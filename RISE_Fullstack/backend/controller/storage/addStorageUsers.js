const { update, find_one } = require("../../database_services/mongo_crud");

const addStorageUsers = async (req, res) => {
    try {
        let { bucketName, newUsers } = req.body;

        let query_params = {
            modelName: "storage_data",
            where: { bucketName: bucketName }
        }
        let check_storage = await find_one(query_params)
        console.log("----->> ", check_storage);
        console.log(newUsers);
        for (let i = 0; i < newUsers.length; i++) {
            if (check_storage.usersAssigned.some(user => user.user_email === newUsers[i].user_email)) {
                continue;
            }
            check_storage.usersAssigned.push(newUsers[i]);
        }
        console.log(check_storage.usersAssigned);
        query_params = {
            modelName: "storage_data",
            where: { bucketName: bucketName },
            updateData: { usersAssigned: check_storage.usersAssigned },
            queryType: 'updateOne'
        }

        await update(query_params);
        return res.json({
            status: 1,
            msgType: "success",
            msg: "Users added to existing instrument",
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

module.exports = { addStorageUsers }