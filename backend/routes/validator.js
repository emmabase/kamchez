const {check, validationResult} = require('express-validator')
import User from '../models/userModel';


const userRegistrationRules = (req, res) =>{
    return [
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
      ]
}

const validateRegistration =  (req, res, next) =>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            const alert = errors.array();
            const extractedErrors = [];
    
            alert.forEach((element, index) =>{
              extractedErrors.push({[element.param]: element.msg})
            })
        console.log(extractedErrors);
        return res.status(400).send({status: 400, errors: extractedErrors})
    }
    return next()
    
}

const userLoginRules = ()=> {
    return [
        check('username').not().isEmpty().withMessage('Realname or KCI is required'),
        check('password').not().isEmpty().withMessage('password is required')
      ]
}

const validateLoginRules = (req, res, next)=>{
    const logginErrors = validationResult(req)
    if(!logginErrors.isEmpty()){
        const logAlert = logginErrors.array();
        const logErrors = [];
        logAlert.forEach((element, index) =>{
          logErrors.push({[element.param]: element.msg})
        })
        console.log(logErrors);
        return res.status(400).send({status: 400, errors: logErrors})
    }
    return next()
}
module.exports = {
    userRegistrationRules,
    validateRegistration,
    userLoginRules,
    validateLoginRules,

  }