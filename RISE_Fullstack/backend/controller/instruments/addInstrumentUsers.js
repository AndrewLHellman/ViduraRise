const { update, find_one } = require("../../database_services/mongo_crud");

const addInstrumentUsers = async (req, res) => {
    try {
        let { _id, newUsers } = req.body;

        let query_params = {
            modelName: "instrumentData",
            where: { _id: _id }
        }
        let check_instrument = await find_one(query_params)
        console.log("----->> ", check_instrument);
        console.log(newUsers);
        for (let i = 0; i < newUsers.length; i++) {
            if (check_instrument.usersAssigned.some(user => user.user_email === newUsers[i].user_email)) {
                continue;
            }
            check_instrument.usersAssigned.push(newUsers[i]);
        }
        console.log(check_instrument.usersAssigned);
        query_params = {
            modelName: "instrumentData",
            where: { _id: _id },
            updateData: { usersAssigned: check_instrument.usersAssigned },
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

module.exports = { addInstrumentUsers }