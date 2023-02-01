const express = require('express');
const engineEjs = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

//initialization 
const app = express();
require('./database');
require('./passport/local-auth')

//settings
app.set('views',path.join(__dirname, 'views'));
app.engine('ejs', engineEjs);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret:'wargs-awrg23r-4t23rfs-qwrg312-12rtgr',
    resave: false,
    saveUninitialized:false
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next)=>{
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.signinMessage = req.flash('signinMessage');
  next();
})

//routes
app.use('/',require('./routes/index.routes'))


//starting the server
app.listen(app.get('port'), ()=> {
    console.log('server on port ', app.get('port'))
});




