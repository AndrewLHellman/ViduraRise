const router = require("express").Router();
const { addInstrumentUsers } = require("../controller/instruments/addInstrumentUsers");
const { getinstruments } = require("../controller/instruments/getinstruments");
const { updateInstruments } = require("../controller/instruments/updateInstruments");


router.post("/getinstruments", getinstruments );
router.post("/updateInstruments", updateInstruments );
router.post("/addInstrumentUsers", addInstrumentUsers);

module.exports = router;
