const router = require("express").Router();
const multer = require('multer');

const { analyzeImage } = require("../controller/imageDetails/analyzeImage");
const { scanButton } = require("../controller/imageDetails/scanButton");
const { showImage } = require("../controller/imageDetails/showImage");
const { uploadScanimage } = require("../controller/imageDetails/uploadScanImage")
const { instrumentScan } = require("../controller/imageDetails/instrumentScan")


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/showImage", showImage);
router.post("/analyzeImage", analyzeImage);
router.post("/scanButton", scanButton);
router.post("/semScan", instrumentScan);
router.post("/upload", upload.single("image"), uploadScanimage);

module.exports = router;
