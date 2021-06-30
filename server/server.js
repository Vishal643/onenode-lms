import express from 'express';
import cors from 'cors';
const morgan = require('morgan');
require('dotenv').config();

import csrf from 'csurf';
import cookieParser from 'cookie-parser';

import mongoose from 'mongoose';
import { readdirSync } from 'fs';

const csrfProtection = csrf({ cookie: true });

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
app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

//routes
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

//csrf protection
app.use(csrfProtection);
app.get('/api/csrf-token', (req, res) => {
	res.json({ csrfToken: req.csrfToken() });
});

//PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
