import express from 'express';

//controllers
import {
	register,
	login,
	logout,
	currentUser,
	sendTestEmail,
	forgotPassword,
	resetPassword,
} from '../controllers/auth';

//middlewares
import { requireSignin } from '../middlewares/index';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/logout', logout);

router.get('/current-user', requireSignin, currentUser);

router.get('/send-email', sendTestEmail);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

module.exports = router;
