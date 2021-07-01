import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			min: 3,
			max: 320,
			required: true,
		},
		slug: {
			type: String,
			lowercase: true,
		},
		content: {
			type: {},
			min: 200,
		},
		video_link: {},
		free_preview: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true, versionKey: false },
);

const courseSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			min: 3,
			max: 320,
			required: true,
		},
		slug: {
			type: String,
			lowercase: true,
		},
		description: {
			type: {},
			min: 200,
			required: true,
		},
		price: {
			type: Number,
			default: 9.99,
		},
		image: {},
		category: String,
		published: {
			type: Boolean,
			default: false,
		},
		paid: {
			type: Boolean,
			default: true,
		},
		instructor: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		lessons: [lessonSchema],
	},
	{ timestamps: true, versionKey: false },
);

export default mongoose.model('Course', courseSchema);
