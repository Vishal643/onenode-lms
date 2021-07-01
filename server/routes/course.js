import express from 'express';

//controllers
import { uploadImage, removeImage, createCourse } from '../controllers/course';

//middlewares
import { isInstructor, requireSignin } from '../middlewares/index';

const router = express.Router();

//image
router.post('/course/upload-image', uploadImage);

router.post('/course/remove-image', removeImage);

//course
router.post('/course', requireSignin, isInstructor, createCourse);

module.exports = router;
