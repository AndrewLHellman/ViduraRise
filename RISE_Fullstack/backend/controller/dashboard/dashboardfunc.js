
const dashboard = async (req, res) => {
    try {
       let dashboardData = {
            "upload": {
                "Sun": 4,
                "Mon": 5,
                "Tue": 1,
                "Wed": 5,
                "Thus": 7,
                "Fri": 6,
                "Sat": 2
            },
            "analyze": {
                "Sun": 1,
                "Mon": 4,
                "Tue": 3,
                "Wed": 8,
                "Thus": 2,
                "Fri": 5,
                "Sat": 2
            }
        }
      
      return res.json({
        status: 1,
        msgType: "success",
        data : dashboardData
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
  
  module.exports = { dashboard };
  