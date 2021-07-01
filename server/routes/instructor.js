import express from 'express';

//controllers
import {
	makeInstructor,
	getAccountStatus,
	currentInstructor,
	instructorCourse,
} from '../controllers/instructor';

//middlewares
import { requireSignin } from '../middlewares/index';

const router = express.Router();

router.post('/make-instructor', requireSignin, makeInstructor);

router.post('/get-account-status', requireSignin, getAccountStatus);

router.get('/current-instructor', requireSignin, currentInstructor);

router.get('/instructor-courses', requireSignin, instructorCourse);

module.exports = router;
