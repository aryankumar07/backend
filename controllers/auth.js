const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

module.exports.getLogin = (req,res,next)=>{
    res.render('auth/login',{
        path : '/login',
        pageTitle : 'Login',
        isAuth : req.user,
    })
}

module.exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const error = validationResult(req);

    if(!error.isEmpty()){
        console.log(error.array()[0].msg);
        return res.status(422)
        .render('auth/login',{
            path : '/login',
            pageTitle : 'Login',
            isAuth : false,
        });

    }

    User.findOne({email:email})
    .then((user)=>{
        if(!user){
            return res.redirect('/login');
        }
        bcrypt.compare(password,user.password)
        .then(result => {
            if (result) {
                req.session.isLoggedin = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                });
            }
            res.redirect('/login');
        })
        .catch(err=> {
            console.log(err);
            res.redirect('/login');
        })
    })
    .catch(err => console.log(err));
}

module.exports.postLogout = (req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    })
}

module.exports.getSignup = (req,res,next)=>{
    res.render('auth/signup',{
        path : '/signup',
        pageTitle : 'Signup',
        isAuth : false,
    })
}

module.exports.postSignup = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const error = validationResult(req);

    if(!error.isEmpty()){
        console.log('an error occured');
        console.log(error.array()[0].msg);
        return res.status(422)
        .render('auth/signup',{
            path : '/signup',
            pageTitle : 'SignUp',
            isAuth : false,
        });
    }

    bcrypt.hash(password,12)
        .then((hashedPassword) => {
            const user = new User({
                email : email,
                password : hashedPassword,
                cart : { items: [] },
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
        })
    .catch(err => {
        console.log(err);
    })
}