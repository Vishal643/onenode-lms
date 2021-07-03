import express from 'express';
import formidable from 'express-formidable';
//controllers
import {
	uploadImage,
	removeImage,
	createCourse,
	getSingleCourse,
	uploadVideo,
	removeVideo,
} from '../controllers/course';

//middlewares
import { isInstructor, requireSignin } from '../middlewares/index';

const router = express.Router();

//image
router.post('/course/upload-image', uploadImage);

router.post('/course/remove-image', removeImage);

//course
router.post('/course', requireSignin, isInstructor, createCourse);

router.get('/course/:slug', getSingleCourse);

router.post('/course/video-upload', requireSignin, formidable(), uploadVideo);

router.post('/course/video-remove', requireSignin, removeVideo);
module.exports = router;
