require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT | 7098;
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const multer = require('multer')
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
// var favicon = require('serve-favicon');
const User = require('./models/user');
const rRouter = require('./routes/subreddits');

// session 
sessionOptions = {
    resave: false,
    saveUninitialized: false,
    secret:process.env.secret,
}

app.use(session(sessionOptions))
app.use(flash())

// setting favicom
// app.use(favicon(path.join(__dirname, 'public','images','favicon.ico')))
// parse file from the form
// multer({dest: ''});
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname,'public')));
// app.use(express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.engine('ejs', ejsMate);

// database connection
async function connect(){
    mongoose.connect(process.env.mongoURI);
}

connect().then(res=>console.log('DB connected'))
    .catch(err=>console.log(err));

// pass required stuff
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// set local var for res

// store the signedUser 
app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.signedUser = req.user;
    next();
})

app.get('/', async (req, res)=>{
    res.render('home');
});

app.use('/r', rRouter);

app.listen(port, ()=>{
    console.log(`app is listening on port ${port}`);
    console.log(process.env.message)
})