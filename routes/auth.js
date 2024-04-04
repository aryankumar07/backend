const express = require('express');

const router = express.Router();

const User = require('../models/user');

const authController = require('../controllers/auth');

const { check } = require('express-validator')


router.get('/login',authController.getLogin);

router.post('/login', 
// check('email').isEmail()
// .normalizeEmail()
// .custom((value,{req})=>{
//     if(value==='test@gmail.com'){
//         throw new Error('Invalid/forbidden email used');
//     }
// }),
// check('password')
// .isLength({
//     min:5,
// })
// .trim()
// .isAlphanumeric(),
authController.postLogin
);

router.post('/logout',authController.postLogout);

router.get('/signup',authController.getSignup);

router.post('/signup',
check('email').isEmail()
.normalizeEmail()
.custom((value)=>{
    // if(value==='test@gmail.com'){
    //     console.log('Forbidden passwordd');
    // }
    return User.findOne({email : value})
    .then((userDoc)=>{
        console.log(userDoc);
        if(userDoc){
            console.log('already exists');
            return Promise.reject('Already exists');
        }})
}),
check('password').isLength({
    min:5,
}
).trim(),
check('confirmPassword')
.trim()
.custom((value,{req})=>{
    if(value!==req.body.password){
        console.log('The password and confirm password doesnot match')
    }
}),

authController.postSignup)






module.exports = router;