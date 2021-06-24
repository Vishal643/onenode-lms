import express from 'express';
import cors from 'cors';
const morgan = require('morgan');
require('dotenv').config();

import mongoose from 'mongoose';
import { readdirSync } from 'fs';

//create express app
const app = express();

//mongodb connection
mongoose
	.connect(process.env.DATABASE_LOCAL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Database connected successfully!');
	})
	.catch((err) => {
		console.log('Database connection error', err);
	});

//apply middlwares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

//PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
