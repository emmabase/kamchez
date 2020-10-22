import express from 'express';
//const path = require('path');
import config from './config';
import mongoose from 'mongoose';
const bodyParser = require('body-parser');
const logger = require('morgan')

import userRoute from './routes/userRoute';

const mongodbUrl = config.MONGODB_URL;
mongoose.connect(mongodbUrl, {
    useNewUrlParser: true, //avoid error in console
    useUnifiedTopology: true,
    useCreateIndex: true,
}).catch(error => console.log(error.reason));

const app = express(); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use("/api/users", userRoute);

app.listen(config.PORT, () =>
{console.log('server started at http://localhost:'+config.PORT)})
// npm install @babel/cli @babel/core @babel/node @babel/preset-env nodemon help to read global node_modules in folder(backend) 