const router = require("express").Router();
const { getinstruments } = require("../controller/instruments/getinstruments");
const { updateInstruments } = require("../controller/instruments/updateInstruments");


router.post("/getinstruments", getinstruments );
router.post("/updateInstruments", updateInstruments );

module.exports = router;
