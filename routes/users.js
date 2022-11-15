require('dotenv').config();
const express = require('express')
const router = express.Router()
const Subreddit = require('../models/subreddit');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

// s3 configuration
const s3AccessKey = process.env.S3_ACCESS_KEY
const s3SecretKey = process.env.S3_SECRET_ACCESS_KEY
const s3Buceket = process.env.S3_BUCKET_REGION

const s3 = new aws.S3({
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretKey,
    region: s3Buceket
})

const upload = multer({
    storage: multerS3({
        // s3 
        s3: s3,
        bucket: "dev-app-clone-994214",
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
          },
          key: function (req, file, cb) {
            cb(null, Date.now()+ "__" + file.originalname);
          }
    })
});

// router.get('/', async(req, res)=>{
//     try{
//         res.render('users/index')
//     } catch(err){

//     }
// })

router.get('/profile', async(req, res)=>{
    try{
        const user = await User.findById(req.user._id);
        res.render('users/index', { url : req.url, user})
    } catch(err){
        console.log(err)
    }
})

router.put('/:id', upload.single('profileImage'), async(req, res)=>{
    try {
        const user = await User.findById(req.user._id);
        if(req.file){
            user.Bio.profileImage.url = req.file.location,
            user.Bio.profileImage.filename = req.file.key
        }
        await user.save();
        res.redirect('/');
    } catch(err){
        console.log('Putting user failed')
    }
})

// exporting using es6
module.exports = router;