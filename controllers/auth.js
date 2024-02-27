exports.getLogin = (req,res,next)=>{
    // const isLoggedIn = req.get('Cookie').split('=')[1];
    res.render('auth/login',{
        path : '/login',
        pageTitle : 'Login',
        isAuth : false,
    })
}

exports.postLogin = (req,res,next)=>{
    // res.setHeader('Set-Cookie','loggedIn=true');
    req.session.isloggedIn = true;
    req.session.user = '65da5c7b54355618de7508dc';
    res.redirect('/')
}