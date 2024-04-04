const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore  = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const multer = require('multer');


const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = MongoDBStore({
  uri : 'mongodb+srv://ak2839426:mongo1234@cluster0.n07gu8v.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0',
  collection: 'sessions',
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination : (req,res,cb)=>{
    cb(null,'images');
  },
  filename : (req,file,cb)=>{
    cb(null,new Date().toISOString() +'-'+file.orignalname);
  }
})

const filefilter = (req,file,cb)=>{
  if(file.mimetype==='image/png' || file.mimetype==='image/jpg'){
    cb(null,true);
  }
  cb(null.false);
}

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage : fileStorage , filefilter : filefilter }).single('image'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(session({secret:'my secret',resave:false,saveUninitialized:false,store:store}));
app.use(csrfProtection);

app.use((req,res,next)=>{
  if(!req.session.user){
    return next();
  }
  // console.log(req.session.user);
  User.findById(req.session.user)
    .then(user => {
      // console.log(user);
      if(!user){
        return next();
      }
      req.user = user;
        next();
    })
    .catch(err => {
      throw new Error(err);
    });
})

app.use((req,res,next)=>{
  res.locals.isAuth = req.session.isLoggedin;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get(errorController.get500);

app.use(errorController.get404);

app.use((error,req,res,next)=>{
  res.redirect('/500');
})

mongoose
  .connect(
    'mongodb+srv://ak2839426:mongo1234@cluster0.n07gu8v.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(result => {
    console.log('connected to mongo');
    app.listen(3000);
  })
  .catch(err => {
    console.log('an error  occured while connecting to mongodb')
    console.log(err);
  });
