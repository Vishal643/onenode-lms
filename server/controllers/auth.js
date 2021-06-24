import User from '../models/user';

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

		return res
			.status(201)
			.json({ user: newUser, msg: 'User Created Successfully!' });
	} catch (err) {
		console.log(err);
		return res.status(400).send('Something went wrong');
	}
};
