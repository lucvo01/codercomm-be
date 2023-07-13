const express = require('express');
require("dotenv").config();

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const { sendResponse } = require("./helpers/utils")
const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);

const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI
mongoose.connect(mongoURI).then(() => console.log("DB connected")).catch((err) => console.log(err))
module.exports = app;
