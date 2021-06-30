import express from 'express';

//controllers
import { uploadImage, removeImage } from '../controllers/course';

//middlewares
import { requireSignin } from '../middlewares/index';

const router = express.Router();

router.post('/course/upload-image', uploadImage);

router.post('/course/remove-image', removeImage);

module.exports = router;
