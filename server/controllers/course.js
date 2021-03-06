import AWS from 'aws-sdk';

import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { readFileSync } from 'fs';
import Course from '../models/course';
import User from '../models/user';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

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

export const getSingleCourse = async (req, res) => {
	try {
		const course = await Course.findOne({ slug: req.params.slug })
			.populate('instructor', '_id name')
			.exec();
		res.json(course);
	} catch (err) {
		console.log(err);
	}
};

export const uploadVideo = async (req, res) => {
	try {
		if (req.user._id != req.params.instructorId) {
			return res.status(400).send('Unauthorized access');
		}
		const { video } = req.files;
		if (!video) return res.status(400).send('No video');

		//video params
		const params = {
			Bucket: 'onenode-bucket',
			Key: `${nanoid()}.${video.type.split('/')[1]}`,
			Body: readFileSync(video.path),
			ACL: 'public-read',
			ContentType: video.type,
		};
		//upload to S3
		S3.upload(params, (err, data) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
			}

			res.send(data);
		});
	} catch (err) {
		console.log(err);
	}
};

export const removeVideo = async (req, res) => {
	try {
		if (req.user._id != req.params.instructorId) {
			return res.status(400).send('Unauthorized access');
		}
		const { Bucket, Key } = req.body;
		if (!Key) return res.status(400).send('No video');

		//video params
		const params = {
			Bucket,
			Key,
		};

		//upload to S3
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

export const addLesson = async (req, res) => {
	try {
		const { slug, instructorId } = req.params;

		const { title, content, video } = req.body;

		if (req.user._id != instructorId) {
			return res.status(400).send('Unauthorized access');
		}

		const updated = await Course.findOneAndUpdate(
			{ slug },
			{
				$push: { lessons: { title, content, video, slug: slugify(title) } },
			},
			{ new: true },
		)
			.populate('instructor', '_id name')
			.exec();
		res.json(updated);
	} catch (err) {
		console.log(err);
		return res.status(400).send('Adding Lesson Failed');
	}
};

export const updateCourse = async (req, res) => {
	const { slug } = req.params;
	try {
		const course = await Course.findOne({ slug }).exec();

		if (course.instructor != req.user._id) {
			return res.status(400).send('Unauthorized');
		}

		const updated = await Course.findOneAndUpdate({ slug }, req.body, {
			new: true,
		}).exec();
		res.status(200).json(updated);
	} catch (err) {
		return res.status(400).send('Updating Course Failed');
	}
};

export const removeLesson = async (req, res) => {
	const { slug, id } = req.params;

	const course = await Course.findOne({ slug }).select('instructor').exec();

	if (course.instructor._id != req.user._id) {
		return res.status(400).send('Unauthorized');
	}

	const deletedCourse = await Course.findByIdAndUpdate(
		course._id,
		{
			$pull: { lessons: { _id: id } },
		},
		{ new: true },
	).exec();
	res.json(deletedCourse);
};

export const updateLesson = async (req, res) => {
	try {
		const { slug } = req.params;
		const { _id, title, content, video, free_preview } = req.body;
		const course = await Course.findOne({ slug }).select('instructor').exec();

		if (course.instructor._id != req.user._id) {
			return res.status(400).send('Unauthorized');
		}

		const updated = await Course.updateOne(
			{ 'lessons._id': _id },
			{
				$set: {
					'lessons.$.title': title,
					'lessons.$.content': content,
					'lessons.$.video': video,
					'lessons.$.free_preview': free_preview,
				},
			},
			{ new: true },
		).exec();

		res.json({ ok: true });
	} catch (err) {
		console.log(err);
		return res.status(400).send('Update Lesson Failed!!!');
	}
};

export const publishCourse = async (req, res) => {
	try {
		const { courseId } = req.params;

		const course = await Course.findById(courseId).select('instructor').exec();

		if (course.instructor._id != req.user._id) {
			return res.status(400).send('Unauthorized');
		}

		const updated = await Course.findByIdAndUpdate(
			courseId,
			{
				published: true,
			},
			{ new: true },
		).exec();
		res.json(updated);
	} catch (err) {
		console.log(err);
		return res.status(400).send('Publish course failed');
	}
};

export const unPublishCourse = async (req, res) => {
	try {
		const { courseId } = req.params;

		const course = await Course.findById(courseId).select('instructor').exec();

		if (course.instructor._id != req.user._id) {
			return res.status(400).send('Unauthorized');
		}

		const updated = await Course.findByIdAndUpdate(
			courseId,
			{
				published: false,
			},
			{ new: true },
		).exec();
		res.json(updated);
	} catch (err) {
		console.log(err);
		return res.status(400).send('unpublish course failed');
	}
};

export const getAllCourses = async (req, res) => {
	const all = await Course.find({ published: true })
		.populate('instructor', '_id name')
		.exec();
	res.json(all);
};

export const checkEnrollment = async (req, res) => {
	const { courseId } = req.params;

	//find courses of the currenlty logged in user
	const user = await User.findById(req.user._id).exec();

	//check if course id is found in user courses array
	let ids = [];
	let length = user.courses && user.courses.length;
	for (let i = 0; i < length; i++) {
		ids.push(user.courses[i].toString());
	}

	res.json({
		status: ids.includes(courseId),
		course: await Course.findById(courseId).exec(),
	});
};

export const freeEnrollment = async (req, res) => {
	try {
		//check if course is free or paid
		const course = await Course.findById(req.params.courseId).exec();
		if (course.paid) return;

		await User.findByIdAndUpdate(
			req.user._id,
			{
				$addToSet: { courses: course._id },
			},
			{ new: true },
		).exec();
		res.json({
			message: 'Congratulations! You have successfully enrolled',
			course,
		});
	} catch (err) {
		return res.status(400).send('Enrollment create failed');
	}
};

export const paidEnrollment = async (req, res) => {
	try {
		//check if course is free or paid
		const course = await Course.findById(req.params.courseId)
			.populate('instructor')
			.exec();
		if (!course.paid) return;

		//application free 30%
		const fee = (course.price * 30) / 100;

		//create stripe session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],

			//purchase details
			line_items: [
				{
					name: course.name,
					amount: Math.round(course.price.toFixed(2) * 100),
					currency: 'inr',
					quantity: 1,
				},
			],

			//charge buyer and transfer remaining balance to seller
			payment_intent_data: {
				application_fee_amount: Math.round(course.price.toFixed(2) * 100),
				transfer_data: {
					destination: course.instructor.stripe_account_id,
				},
			},

			//redirect url after successful payment
			success_url: `${process.env.STRIPE_SUCCESS_URL}/${course._id}`,
			cancel_url: process.env.STRIPE_CANCEL_URL,
		});

		// console.log('session id => ', session);
		await User.findByIdAndUpdate(req.user._id, {
			stripeSession: session,
		}).exec();

		res.send(session.id);
	} catch (err) {
		res.status(400).send('Paid Enrollment error');
	}
};

export const stripeSuccess = async (req, res) => {
	try {
		const course = await Course.findById(req.params.courseId).exec();

		const user = await User.findById(req.user._id).exec();

		if (!user.stripeSession.id) {
			return res.sendStatus(400);
		}

		//retrieve stripe session
		const session = await stripe.checkout.sessions.retrieve(
			user.stripeSession.id,
		);

		//if session payment status is paid push course to user course array
		if (session.payment_status === 'paid') {
			await User.findByIdAndUpdate(user._id, {
				$addToSet: { courses: course._id },
				$set: { stripeSession: {} },
			}).exec();
		}
		res.json({ success: true, course });
	} catch (err) {
		res.json({ success: false });
	}
};

export const userCourses = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).exec();

		const courses = await Course.find({ _id: { $in: user.courses } })
			.populate('instructor', '_id name')
			.exec();

		res.json(courses);
	} catch (err) {
		res.status(400).send('Something went wrong.');
	}
};
