const { update, find_one } = require("../../database_services/mongo_crud");

const addProjectUsers = async (req, res) => {
    try {
        let { uniqueId, newUsers } = req.body;

        let query_params = {
            modelName: "projectData",
            where: { uniqueId: uniqueId }
        }
        let check_project = await find_one(query_params)
        console.log("----->> ", check_project);
        console.log(newUsers);
        for (let i = 0; i < newUsers.length; i++) {
            if (check_project.usersAssigned.some(user => user.user_email === newUsers[i].user_email)) {
                continue;
            }
            check_project.usersAssigned.push(newUsers[i]);
        }
        console.log(check_project.usersAssigned);
        query_params = {
            modelName: "projectData",
            where: { uniqueId: uniqueId },
            updateData: { usersAssigned: check_project.usersAssigned },
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

module.exports = { addProjectUsers }