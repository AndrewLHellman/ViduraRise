const { insertquery, find_one } = require("../../database_services/mongo_crud");
const { nanoid } = require("nanoid");

const generateUniqueProjectId = async () => {
    do {
        uniqueId = nanoid(7);

        let query_params = {
            modelName: "projectData",
            where: { uniqueId: uniqueId },
        };
        check_storage = await find_one(query_params);
    } while (check_storage != null);

    return uniqueId;
}

const addProject = async (req, res) => {
    try {
        let {
            type,
            description,
            projectName,
            storageAssign,
            instruments,
            user_email
        } = req.body;

        console.log("requested data-->>", req.body);

        uniqueId = await generateUniqueProjectId();

        var data = {
            uniqueId: uniqueId,
            type: type,
            description: description,
            projectName: projectName,
            instruments: { in_name: "EMC SEM-7" },
            storageAssign: storageAssign.map((storage) => ({ "st_name": storage})),
            instruments: instruments,
            usersAssigned:[{ user_email: user_email }]
        };

        let query_params = {
            modelName: "projectData",
            where: { projectName: projectName }
        };

        check_storage = await find_one(query_params);

        if (check_storage == null) {
            query_params = {
                modelName: "projectData",
                data: data
            };
            await insertquery(query_params);
            return res.json({
                status: 1,
                msgType: "success",
                msg: "Project Added!",
                data: data,
            });
        } else {
            return res.json({
                status: 2,
                msgType: "success",
                msg: "Project already exists!",
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

module.exports = { addProject };