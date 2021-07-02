import express from 'express';

//controllers
import {
	uploadImage,
	removeImage,
	createCourse,
	getSingleCourse,
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

module.exports = router;
