const router = require("express").Router();

// const { showImage }  = require('../controller/s3_communication/showImage')
const{ imagedetails } = require("../controller/s3_communication/imagedetails")
const { allstorage } = require("../controller/s3_communication/getbuckets")

// router.post("/showImage",  showImage);
router.post("/imagedetails", imagedetails);
router.get("/allstorage", allstorage);


module.exports = router;
