require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 7098;
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
const subredditRouter = require('./routes/subreddits');
const authRoute = require('./routes/auth-route');
const url = "mongodb://localhost:27017/reddit"
const Post = require('./models/post')
const Subreddit = require('./models/subreddit');
const post = require('./models/post');

// session 
sessionOptions = {
    resave: false,
    saveUninitialized: false,
    secret:"asvEtt#4215",
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
    // edit here
    mongoose.connect(url);
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
    try {
        const r = await Subreddit.find().limit(5)
        const posts = await Post.find().populate('subreddit').populate('user')
        console.log(req.url);
        res.render('home', {posts, r, url: req.url})
    }
    catch(err){
        console.log(err)
        res.send(`something went wrong in homepage`)
    }
    // res.render('home');
});

// to create a subreddit
app.post('/r', async(req, res)=>{
    try{
      const body = req.body;
      console.log(req.body);
      const user = await User.findById(req.user._id);
      const subreddit = new Subreddit(body)
      user.subreddits.push(subreddit)
      subreddit.creator = user;
      await user.save();
      await subreddit.save();
      res.redirect(`/r/${subreddit.r}`)
    }catch(err){
      console.log(err)
      res.send('something went wrong in POST /r')
    }
  })

app.get('/submit', async(req,res)=>{
    res.render('submit/new')
})

app.use('/r', subredditRouter);
app.use('/users', authRoute);

app.listen(port, ()=>{
    console.log(`app is listening on: http://localhost:${port}`);
})