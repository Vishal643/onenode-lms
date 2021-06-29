import User from '../models/user';

import jwt from 'jsonwebtoken';

import AWS from 'aws-sdk';

import { nanoid } from 'nanoid';

//aws config
const awsConfig = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
	apiVersion: process.env.AWS_API_VERSION,
};
const SES = new AWS.SES(awsConfig);

//helper functions to hash and compare password
import { hashPassword, comparePassword } from '../utils/auth';

export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		//validation
		if (!name) {
			return res.status(400).send('Name is required!');
		}

		if (!password || password.length < 6) {
			return res
				.status(400)
				.send('Password must be atleast 6 characters long!');
		}

		let user = await User.findOne({ email }).exec();

		if (user) {
			return res.status(400).send('User with this email already exits!');
		}

		//hased password
		const hashedPassword = await hashPassword(password);

		//register user and save to db
		const newUser = await new User({
			name,
			email,
			password: hashedPassword,
		}).save();

		return res.status(201).json({ user: newUser, message: 'Signup Success!' });
	} catch (err) {
		console.log(err);
		return res.status(400).send('Something went wrong');
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		let user = await User.findOne({ email }).exec();

		if (!user) {
			return res.status(400).send('No user found');
		}

		//check password
		const match = await comparePassword(password, user.password);
		if (!match) {
			return res.status(400).send('Wrong password');
		}
		//create signed jwt
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '7d',
		});

		//return user and token to client, excluding by hashed password
		user.password = undefined;

		//send token in cookie
		res.cookie('token', token, {
			httpOnly: true,
			// secure: true,  //for https
		});
		res.json(user);
	} catch (err) {
		console.log(err);
		return res.status(400).send('Something went wrong');
	}
};

export const logout = async (req, res) => {
	try {
		res.clearCookie('token');
		return res.json({ message: 'Signout Success' });
	} catch (err) {
		console.log(err);
	}
};

export const currentUser = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select('-password').exec();
		return res.json({ ok: true });
	} catch (err) {
		console.log(err);
	}
};

export const sendTestEmail = async (req, res) => {
	const params = {
		Source: process.env.EMAIL_FROM,
		Destination: {
			ToAddresses: ['vishalkumar199812@gmail.com'],
		},
		ReplyToAddresses: [process.env.EMAIL_FROM],
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: `
					
						<html>
							<h1>Reset Password Link</h1>
							<p>Please use the following link to reset your password</p>
						</html>
					`,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: 'Password Reset Link',
			},
		},
	};

	const emailSent = SES.sendEmail(params).promise();

	emailSent
		.then((data) => {
			console.log(data);
			res.json({ ok: true });
		})
		.catch((err) => {
			console.log(err);
		});
};

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		const shortCode = nanoid(6).toUpperCase();

		const user = await User.findOneAndUpdate(
			{ email },
			{ passwordResetCode: shortCode },
		);

		if (!user) {
			return res.status(400).send('User not found');
		}

		//prepare for email

		const params = {
			Source: process.env.EMAIL_FROM,
			Destination: {
				ToAddresses: [email],
			},
			Message: {
				Body: {
					Html: {
						Charset: 'UTF-8',
						Data: `
							<html>
								<h1>Reset Password</h1>
								<p>Use this code to reset your password</p>
								<h2 style="color: red;">${shortCode}</h2>
								<i>onenode.com</i>
							</html>
						`,
					},
				},
				Subject: {
					Charset: 'UTF-8',
					Data: 'Reset Password Code',
				},
			},
		};

		const emailSent = SES.sendEmail(params).promise();
		emailSent
			.then((data) => {
				res.json({ ok: true });
			})
			.catch((err) => {
				console.log(err);
			});
	} catch (err) {
		console.log(err);
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { email, code, newPassword } = req.body;

		const hashedPassword = await hashPassword(newPassword);

		const user = User.findOneAndUpdate(
			{
				email,
				passwordResetCode: code,
			},
			{
				password: hashedPassword,
				passwordResetCode: '',
			},
		).exec();

		res.json({ ok: true });
	} catch (err) {
		console.log(err);
		return res.status(400).send('Error! Try again.');
	}
};
