const {getStorage } = require('../controller/storage/storage');
const { update_bucket_metadata } = require('../controller/storage/storageUpdate')
const { cal_bucket_usage_imgcount } = require('../controller/storage/updateStorageMetadata')
const { addStorage } = require('../controller/storage/addStorage')

const router = require("express").Router();


router.post('/getStorage', getStorage);
router.post('/updateStorage', update_bucket_metadata);
router.post('/bucket_metadata', cal_bucket_usage_imgcount);
router.post('/addStorage', addStorage);


module.exports = router;