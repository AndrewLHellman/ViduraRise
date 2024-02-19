const { find_one } = require("../../database_services/mongo_crud");
const bcrypt = require("bcrypt");

const authenticateUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    let query_params = {
      modelName: "user_data",
      where: { email: email },
    };

    check_user = await find_one(query_params);
    
    if (check_user == null) {
      return res.json({
        status: 2,
        msgType: "success",
        msg:'User not found with this email',
      });
    } 
    else {
      const hash = check_user.password;
      const okk = bcrypt.compareSync(password, hash);
      if (okk == false) {
        return res.json({
          status: 2,
          msgType: "success",
          msg: 'Password incorrect'
        });
      }
      req.session.user = { email: email, userName: check_user.firstname, sessionId:req.sessionID};
    }
    return res.json({
      status: 1,
      msgType: "success",
      msg: 'Logged In!',
      data: req.session.user 
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

module.exports = { authenticateUser};
