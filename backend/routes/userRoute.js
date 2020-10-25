import express from 'express';
import { getToken, isAuth, isAdmin } from '../util';
import User from '../models/userModel';
import VerifyAccount from '../models/verifyAccountModel';
import servicePoint from '../models/servicePointModel';
import UserDevices from '../models/userDevicesModel';
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const {userRegistrationRules, validateRegistration, userLoginRules, validateLoginRules} = require('./validator');


router.post('/register', userRegistrationRules(), validateRegistration, async(req, res) =>{
      try{
        const {email, firstname, lastname, password, gender, phone, profession} = req.body;
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
            to: email,       
            subject: 'Kamchezreal Account Activation',
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
            email,
            token: regCode,
            
        })
        await verify.save();
    
      const capitalizer = (string) => {
          return string && string.charAt(0).toUpperCase() + string.substring(1);
      };
      let realName = capitalizer(firstname)+capitalizer(lastname)+profession[0].toUpperCase();
    
      let realNameExists = await User.findOne({realName});
    
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
        const userToken = getToken(newUser)

        const userDevices = new UserDevices({
          userId: newUser._id,
          token: userToken,
          
      })

      await userDevices.save();
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
          profession: [serviceUsers],
         })
    
         await serviceUser.save();
           if(newUser){
              return res.status(200).send({
                _id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                token: userToken,
                verifyCode: regCode,
            });
        }else{
            return res.status(404).send({msg: "Registration was unsuccessful"})
        }

      }catch(error){
        console.log(error);
        res.status(500).send({msg: "An unexpected error occurred"})
      } 
})

router.post('/login', userLoginRules(), validateLoginRules, async (req, res) =>{
      try{ 
        const username = await User.findOne({
            $or: [
                   { realName : { $regex: new RegExp("^" + req.body.username.toLowerCase(), "i") } },
                   { kci: { $regex: new RegExp("^" + req.body.username.toLowerCase(), "i") } }
                 ]
            });
          if(!username){
            res.status(404).send({msg: "provide a valid realname or kci"})
          }else if(! await bcrypt.compare(req.body.password, username.password)){
          return  res.status(404).send({msg: "password is incorrect"});
          }
          return res.send({
              _id: username.id,
              name: username.firstname,
              email: username.email,
              token: getToken(username)
    
          });
        }catch(erno){
            console.log(erno)
        }
});

router.post('/confirm_account_user', async (req, res) =>{
  try{
    const { verifyCode, email, fcmToken, _id } = req.body;  
      const getAccount = await VerifyAccount.findOne({
        email,
        token:verifyCode
      })
      console.log(getAccount);
      if(getAccount){
        let now = new Date();
        let previous=new Date(getAccount.tokenTime)
        let difference=previous > now ? previous-now : now - previous
        let diff_min = Math.floor(difference/(1000*60))
        if (diff_min <= 5) {
            await User.updateOne(
              { _id },
              { $set:
                 {
                   notificationKey: fcmToken,
                  
                 }
              }
           )
           await UserDevices.updateOne(
            { userId: _id },
            { $set:
               {
                 token: fcmToken,
                
               }
            }
         )
         await User.updateOne(
          {_id },
          { $set:
             {
               confirmed: 1,
              
             }
          }
       )
        await VerifyAccount.deleteOne( { email } )
        return res.status(200).send({msg: "Verification was successful"})

        }else{
         await VerifyAccount.deleteOne( { email } )
         await User.deleteOne( { email } )
         return res.status(400).send({msg: "Verification failed or session expired. Please register afresh"})
      }
  }
  return res.status(400).send({msg: "Records not found, failed to process"})

  }catch(error){
   console.log(error);
  }

});

export default router;