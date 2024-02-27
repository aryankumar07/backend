const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = mongoDbStore({
  uri : 'mongodb+srv://ak2839426:mongo1234@cluster0.n07gu8v.mongodb.net/Shop?retryWrites=true&w=majority&appName=Cluster0',
  collection : 'session '
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'my secret',
  resave : false,
  saveUninitialized : false,
  store : store
}))

// app.use((req, res, next) => {
//   User.findById('65da5c7b54355618de7508dc')
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://ak2839426:mongo1234@cluster0.n07gu8v.mongodb.net/Shop?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
