import User from '../models/user';
import queryString from 'query-string';
import Course from '../models/course';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

export const makeInstructor = async (req, res) => {
	try {
		//1. find user from db
		const user = await User.findById(req.user._id).exec();

		//2. if user do not have stripe account_id yet then create the new one
		if (!user.stripe_account_id) {
			const account = await stripe.accounts.create({
				type: 'standard',
			});
			user.stripe_account_id = account.id;
			user.save();
		}
		//3. create account link based on account id (for frotend to complete onboarding)
		let accountLink = await stripe.accountLinks.create({
			account: user.stripe_account_id,
			refresh_url: process.env.STRIPE_REDIRECT_URL,
			return_url: process.env.STRIPE_REDIRECT_URL,
			type: 'account_onboarding',
		});
		//4. pre-fill any info such as email (optional), then send url response to frontend
		accountLink = Object.assign(accountLink, {
			'stripe_user[email]': user.email,
		});

		//5. send the account link as response to frontend
		res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
	} catch (err) {
		console.log(err);
	}
};

export const getAccountStatus = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).exec();
		const account = await stripe.accounts.retrieve(user.stripe_account_id);

		if (!account.charges_enabled) {
			return res.status(401).send('Unauthorized');
		} else {
			const statusUpdated = await User.findByIdAndUpdate(
				user._id,
				{
					stripe_seller: account,
					$addToSet: { role: 'Instructor' },
				},
				{ new: true },
			)
				.select('-password')
				.exec();

			res.json(statusUpdated);
		}
	} catch (err) {
		console.log(err);
	}
};

export const currentInstructor = async (req, res) => {
	try {
		let user = await User.findById(req.user._id).select('-password').exec();
		if (!user.role.includes('Instructor')) {
			return res.sendStatus(403);
		} else {
			res.json({ ok: true });
		}
	} catch (err) {
		console.log(err);
	}
};

export const instructorCourse = async (req, res) => {
	try {
		const course = await Course.find({
			instructor: req.user._id,
		})
			.sort({ createdAt: -1 })
			.exec();
		res.send(course);
	} catch (err) {
		console.log(err);
	}
};
