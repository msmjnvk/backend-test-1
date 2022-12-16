const express = require('express');
const fileUpload = require('express-fileupload');
var slugify = require('slugify')
const app = express();


app.use(express.json());
app.use(fileUpload());
const { validationResult, check } = require('express-validator');
'use strict';

const fs = require('fs');

app.post('/api/post/add',
    check('title')
        .exists().withMessage('title field is required').bail()
        .isLength({ min: 5,max:50}).withMessage('Title must have min 5 and max 50 character').bail()
        .matches(/^[a-z0-9 ]+$/i).withMessage('title should not contain any special character').bail()
        ,
    check('description')
        .exists().withMessage('description field is required').bail()
        .isLength({max: 500}).withMessage('description must max 50 character').bail()
        ,
    check('date_time') 
        .exists().withMessage('date_time field is required').bail()
        ,
    async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.json(req.body.title);
    // req.body.description
    // req.body.main_image
    // req.body.additional_images
    // req.body.date_time
});

app.get('/api/allposts',async (req,res) => {
    let rawdata = fs.readFileSync('blogs.json');
    let blogs = JSON.parse(rawdata);
    blogs.forEach(function(blog) {
            blog.title = slugify(blog.title, '_');
            blog.date_time = new Date(blog.date_time*1000).toISOString();
        });
    res.send(blogs);
});


const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening to ${port}...`))