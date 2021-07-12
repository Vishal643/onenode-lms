import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			min: 6,
			max: 64,
		},
		passwordResetCode: {
			data: String,
			default: '',
		},
		picture: {
			type: String,
			default: '/avatar.png',
		},
		role: {
			type: [String],
			default: ['Subscriber'],
			enum: ['Subscriber', 'Instructor', 'Admin'],
		},

		stripe_account_id: '',
		stripe_seller: {},
		stripeSession: {},
		courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
	},
	{ timestamps: true, versionKey: false },
);

export default mongoose.model('User', userSchema);
