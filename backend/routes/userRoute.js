import express from 'express';
import { getToken, isAuth, isAdmin } from '../util';
import User from '../models/userModel';
import VerifyAccount from '../models/verifyAccountModel';
import servicePoint from '../models/servicePointModel';
const router = express.Router();
const nodemailer = require('nodemailer');
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');

router.post('/register', [
    check('firstname').not().isEmpty().withMessage('Firstname is required'),
    check('lastname').not().isEmpty().withMessage('Lastname is required'),
    check('phone').not().isEmpty().withMessage('phone is required'),
    check('email').not().isEmpty().withMessage('Email is required').isEmail().withMessage('Invalid Email')
    .custom((value, {req}) => {
      return new Promise((resolve, reject) => {
        User.findOne({email:req.body.email}, (err, user) => {
          console.log(user)
          if(err) {
            reject(new Error('Server Error'))
          }
          if(Boolean(user)) {
            
            reject(new Error('E-mail already in use'))
          }
          resolve(true)
        });
      });
    }),
    check('gender').not().isEmpty().withMessage('Gender is required'),
    check('profession').not().isEmpty().withMessage('Profession is required'),
    check('password').not().isEmpty().withMessage('Password is required'),
    check('confirmPassword', 'Passwords do not match').exists()
    .custom((value, { req }) => value === req.body.password)
  ],

  async (req, res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const alert = errors.array();
        const extractedErrors = [];

        alert.forEach((element, index) =>{
          extractedErrors.push(element.msg)
        })
        console.log(extractedErrors);
        return res.status(400).send({status: 400, errors: extractedErrors})
    }else{
     
      try{

        const {email, firstname, lastname, password, gender, phone, profession} = req.body;
        const userEmail = email;
        const firstName = firstname.toUpperCase();
        const regCode = Math.floor(100000 + Math.random() * 900000);
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
               user: 'officialkamchezreal@gmail.com',
               pass: 'eneche123?'
            }
        });
        const message = {
            from: 'kamchezreal@gmail.com',
            to: userEmail,       
            subject: '',
            html: `<h4> Kamchezreal Account confirmation </h4>
            <p>Dear <b>${firstName}</b> Kindly complete your registration with this code: </p>
            <p> <b>${regCode}</b> </p><br><span>Kamchezreal team::</span>`
        };
    
        transport.sendMail(message, (err, info) => {
            if (err) {
              console.log(err)
            } else {
              console.log(info);
            }
        });
    
        const verify = new VerifyAccount({
            email: userEmail,
            token: regCode,
            
        })
        await verify.save();
    
      const capitalizer = (string) => {
          return string && string.charAt(0).toUpperCase() + string.substring(1);
      };
      let realName = capitalizer(firstname)+capitalizer(lastname)+profession[0].toUpperCase();
    
      let realNameExists = await User.findOne({realName : realName});
    
        if(realNameExists){
          realNameExists.length > 0 ? realName = capitalizer(firstname)+capitalizer(lastname)+profession[0].toUpperCase()+realNameExists.length
          : realName = realName;
    
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword  = await bcrypt.hash(password, salt)
        const user = new User({
         realName: realName,
         firstname: firstname.toLowerCase(), 
         lastname: lastname.toLowerCase(),
         phone: phone,
         email: email,
         gender: gender,
         password: hashedPassword, 
        });
        const newUser = await user.save();
        const insert_id = await User.find().sort({"_id" : -1}).limit(1);
        const allUsers = await User.find();
    
        await User.updateOne(
          { _id: insert_id },
          { $set:
             {
               kci: "KCI" + allUsers.length,
              
             }
          }
       )
       let serviceUsers = [];
          profession.forEach((element, index) => {
          serviceUsers.push(index);
      });
         const serviceUser = new servicePoint({
          userId: newUser._id,
          profession: [serviceUsers]
         })
    
         await serviceUser.save();
           if(newUser){
              res.status(200).send({
                _id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
                token: getToken(newUser)
     
            });
        }else{
            res.status(404).send({msg: "Registration was unsuccessful"})
        }

      }catch{
        res.status(500).send({msg: "An unexpected error occurred"})
      }

   }
 
})

router.post('/login', [
  check('username').not().isEmpty().withMessage('Realname or KCI is required'),
  check('password').not().isEmpty().withMessage('password is required')
],
  async (req, res) =>{
    const logginErrors = validationResult(req)
    if(!logginErrors.isEmpty()){
        const logAlert = logginErrors.array();
        const logErrors = [];

        logAlert.forEach((element, index) =>{
          logErrors.push(element.msg)
        })
        console.log(logErrors);
        return res.status(400).send({status: 400, errors: logErrors})
    }else{
      try{
        const username = await User.findOne({
            $or: [
                   { realName : { $regex: new RegExp("^" + req.body.username.toLowerCase(), "i") } },
                   { kci: { $regex: new RegExp("^" + req.body.username.toLowerCase(), "i") } }
                 ]
            });
          if(!username){
            return res.status(404).send({msg: "provide a valid realname or kci"})
          }
          if (! await bcrypt.compare(req.body.password, username.password)){
            return res.status(404).send({msg: "password is invalid"});
          }
          if(username){
              res.send({
                  _id: username.id,
                  name: username.firstname,
                  email: username.email,
                  token: getToken(username, "starcoder:)")
        
              });
            }else{
                res.status(404).send({msg: "cannot find user"})
            } 
          }catch(erno){
            console.log(erno)
          }

    }

});

 export default router;