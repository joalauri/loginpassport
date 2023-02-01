const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done)=>{
  done(null,user.id)
})
passport.deserializeUser(async (id, done)=>{
  const user = await User.findById(id);
  done(null, user);
})

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email', 
  passwordField: 'password',
  passReqToCallback: true
},async (req, email, password, done)=>{
   const userCheck = await User.findOne({email: email});
    if(userCheck){
      console.log("paso por acá")
      return done(null,false, req.flash('signupMessage','The Email is alredy exist'));
    }else{
      const newUser = new User();
      newUser.email = email;
      newUser.password = newUser.encryptPass(password);
        await newUser.save();
        done(null, newUser);
    }
}));

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email', 
  passwordField: 'password',
  passReqToCallback: true
},async (req, email, password, done)=>{
  const userSignIn = await User.findOne({email: email});
  if(!userSignIn){
    return done(null, false, req.flash('signInMessage','No user found'))
  }
  if(!userSignIn.comparePass(password)){
    return done(null, false, req.flash('signinMessage','Incorrect pass...'))
  }
  done(null, userSignIn)
}))