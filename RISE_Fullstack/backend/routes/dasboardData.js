const router = require("express").Router();
const { dashboard } = require('../controller/dashboard/dashboardfunc')


router.get("/dashboard",  dashboard);

module.exports = router;
