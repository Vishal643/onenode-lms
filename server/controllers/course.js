import AWS from 'aws-sdk';

import { nanoid } from 'nanoid';
import slugify from 'slugify';

import Course from '../models/course';

//aws config
const awsConfig = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
	apiVersion: process.env.AWS_API_VERSION,
};
const S3 = new AWS.S3(awsConfig);

export const uploadImage = async (req, res) => {
	try {
		const { image } = req.body;
		if (!image) {
			return res.status(400).send('No Image');
		}

		//prepare image
		const base64Data = new Buffer.from(
			image.replace(/^data:image\/\w+;base64,/, ''),
			'base64',
		);

		const type = image.split(';')[0].split('/')[1];
		//image params
		const params = {
			Bucket: 'onenode-bucket',
			Key: `${nanoid()}.${type}`,
			Body: base64Data,
			ACL: 'public-read',
			ContentEncoding: 'base64',
			ContentType: `image/${type}`,
		};

		//upload to s3
		S3.upload(params, (err, data) => {
			if (err) {
				console.log(err);
				return res.sendStatus(400);
			}
			res.send(data);
		});
	} catch (err) {
		console.log(err);
	}
};

export const removeImage = async (req, res) => {
	try {
		const { image } = req.body;

		//image params
		const params = {
			Bucket: image.Bucket,
			Key: image.Key,
		};

		//send remove request to S3
		S3.deleteObject(params, (err, data) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
			}
			res.send({ ok: true });
		});
	} catch (err) {
		console.log(err);
	}
};

export const createCourse = async (req, res) => {
	try {
		const course = await Course.findOne({
			slug: slugify(req.body.name.toLowerCase()),
		});

		if (course) {
			return res.status(400).send('Title is taken');
		}

		const newCourse = await new Course({
			slug: slugify(req.body.name),
			instructor: req.user._id,
			...req.body,
		}).save();

		res.json(course);
	} catch (err) {
		console.log(err);
		return res.status(400).send('Course create failed. Try again.');
	}
};
