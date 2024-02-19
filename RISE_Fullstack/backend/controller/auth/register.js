const { insertquery, find_one } = require("../../database_services/mongo_crud");
const bcrypt = require("bcrypt");
require("dotenv").config();

const signUpData = async (req, res) => {
  try {
    let {
      email,
      firstname,
      lastname,
      address,
      contact,
      inputCountry,
      inputZip,
      password,
    } = req.body;

    console.log("requested data-->>", req.body);
    const hash = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS)); //password encrypted

    var data = {
      email: email,
      firstname: firstname,
      lastname: lastname,
      address: address,
      contact: contact,
      inputCountry: inputCountry,
      inputZip: inputZip,
      password: hash,
    };

    let query_params = {
      modelName: "user_data",
      where: { email: email },
    };

    check_user = await find_one(query_params);

    if (check_user == null) {
      query_params = {
        modelName: "user_data",
        data: data,
      };
      await insertquery(query_params);
      return res.json({
        status: 1,
        msgType: "success",
        msg: "User Registered!",
        // data: data,
      });
    } else {
      return res.json({
        status: 2,
        msgType: "success",
        msg: "Email already exists!",
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
};

module.exports = { signUpData };
