import express from 'express';
import formidable from 'express-formidable';
//controllers
import {
	uploadImage,
	removeImage,
	createCourse,
	getAllCourses,
	getSingleCourse,
	uploadVideo,
	removeVideo,
	addLesson,
	updateCourse,
	removeLesson,
	updateLesson,
	publishCourse,
	unPublishCourse,
} from '../controllers/course';

//middlewares
import { isInstructor, requireSignin } from '../middlewares/index';

const router = express.Router();

//image
router.post('/course/upload-image', uploadImage);

router.post('/course/remove-image', removeImage);

//course
router.get('/courses', getAllCourses);

router.post('/course', requireSignin, isInstructor, createCourse);

router.put('/course/:slug', requireSignin, updateCourse);

router.get('/course/:slug', getSingleCourse);

router.post(
	'/course/video-upload/:instructorId',
	requireSignin,
	formidable(),
	uploadVideo,
);

router.post('/course/video-remove/:instructorId', requireSignin, removeVideo);

//Publish and Unpublis course
router.put('/course/publish/:courseId', requireSignin, publishCourse);
router.put('/course/unpublish/:courseId', requireSignin, unPublishCourse);

router.post('/course/lesson/:slug/:instructorId', requireSignin, addLesson);
router.put('/course/lesson/:slug/:instructorId', requireSignin, updateLesson);
router.put('/course/:slug/:id', requireSignin, removeLesson);

module.exports = router;
