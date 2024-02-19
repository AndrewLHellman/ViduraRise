const {getAllProjects } = require('../controller/projects/getProjects');
const { projectDetails, image_data } = require('../controller/projects/projectDetails'); 
const { getAllProjectimages } = require('../controller/projects/insideProject') 
const { deleteImage } = require('../controller/projects/deleteImage') 
const { updateProject }  = require('../controller/projects/updateProject')
const { addProject } = require('../controller/projects/addProject')

const router = require("express").Router();


router.get('/allProjects', getAllProjects);
router.get('/projectDetails',projectDetails);
router.get('/image_data',image_data);
router.post('/getAllImages', getAllProjectimages);
router.post('/deleteImage', deleteImage)
router.post('/updateProject', updateProject)
router.post('/addProject', addProject)

module.exports = router;