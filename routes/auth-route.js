const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const router = express.Router()

router.get('/signup', async(req, res)=>{
    console.log('signup page')
    res.render('authentication/signup.ejs')
});

router.get('/login', async(req, res)=>{
    console.log('login page')
    res.render('authentication/login.ejs')
});

router.post('/', async(req, res)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({
            email,
            username
        });
        user.Bio.profileImage.url = 'https://dev-app-clone-994214.s3.amazonaws.com/1646642994810__cat.jpg';
        const registeredUser = await User.register(user, password);
        await registeredUser.save();
        res.redirect('/users/login');
    } catch(err){
        res.send('some error occured')
    }
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect:'/users/login'}), async(req, res)=>{
    try{
        console.log('logged in')
        // console.log(req.user)
        res.redirect('/');
    } catch(err){
        console.log('error occued in /users/login');
        res.redirect('/');
    }
})

router.get('/logout', async(req, res)=>{
    req.logout((err)=>{
        if(err){
            console.log('error in logout')
        }
    });
    res.redirect('/')
})

router.get('/', async(req, res)=>{
    try{
        res.render('users/index', {url: req.url})
    } catch(err){
        res.send(err)
    }
})
module.exports = router;