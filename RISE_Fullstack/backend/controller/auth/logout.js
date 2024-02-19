
const logoutUser = async (req, res) => {
  try {
    req.session.destroy();
    console.log("User logged out session destroyed.")
    
    return res.json({
      status: 1,
      msgType: "success",
      msg: 'Logout Successfully!'
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

module.exports = { logoutUser};
