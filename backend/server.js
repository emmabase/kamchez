import express from 'express';
//const path = require('path');
import config from './config';
import mongoose from 'mongoose';



const mongodbUrl = config.MONGODB_URL;
mongoose.connect(mongodbUrl, {
    useNewUrlParser: true, //avoid error in console
    useUnifiedTopology: true,
    useCreateIndex: true,
}).catch(error => console.log(error.reason));

const app = express(); 

//app.use(bodyParser.json());



app.listen(config.PORT, () =>
{console.log('server started at http://localhost:5000')})
// npm install @babel/cli @babel/core @babel/node @babel/preset-env nodemon 