const express = require('express');
const fileUpload =  require('express-fileupload');
const { validationResult, check } = require('express-validator');
const fs = require('fs');
var slugify = require('slugify');
const multer = require("multer");

const app = express();
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "images")
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + ".jpg")
        }
    })
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
'use strict';

app.post('/api/post/add', fileUpload({createParentPath: true}),
    check('title')
        .exists().withMessage('title field is required').bail()
        .isLength({ min: 5, max: 50 }).withMessage('Title must have min 5 and max 50 character').bail()
        .matches(/^[a-z0-9 ]+$/i).withMessage('title should not contain any special character').bail()
    ,
    check('description')
        .exists().withMessage('description field is required').bail()
        .isLength({ max: 500 }).withMessage('description must max 50 character').bail()
    ,
    check('date_time')
        .exists().withMessage('date_time field is required').bail()
    ,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const files = req.files;
        if(!files.main_image){
            return res.status(400).json({ errors: 'Main Image required' });
        }
        if(files.main_image.size>1000000){
            return res.status(400).json({ errors: 'Image size should be less than 1Mb' });
        }
        console.log(files.main_image.name.split('.')[1]);
        // if (files.main_image.name.split('.')[1] == 'jpg') {
        //     return res.status(400).json({ errors: 'Image foramt should be jpg' });
        // }
        if(files.additional_images.length>5){
            return res.status(400).json({ errors: 'Upload Max 5 Images' });
        }



        console.log(files);

        const blog = {
            reference: '000001',
            title: req.body.title,
            description: req.body.description,
            main_image: 'img21.jpg',
            additional_images: ['img23.jpg', 'img24.jpg'],
            date_time: '19876578746'
        };
        res.send(JSON.stringify(blog));
        // req.body.description
        // req.body.main_image
        // req.body.additional_images
        // req.body.date_time
    });

app.get('/api/allposts', async (req, res) => {
    let rawdata = fs.readFileSync('blogs.json');
    let blogs = JSON.parse(rawdata);
    blogs.forEach(function (blog) {
        blog.title = slugify(blog.title, '_');
        blog.date_time = new Date(blog.date_time * 1000).toISOString();
    });
    res.send(blogs);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to ${port}...`))