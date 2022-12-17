const express = require('express');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const { validationResult, check } = require('express-validator');
const fs = require('fs');
var slugify = require('slugify');
const multer = require("multer");
const jwt = require('jsonwebtoken');

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

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, imagePath) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.body.imagePath = imagePath
      next()
    })
  }

dotenv.config();
process.env.TOKEN_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
'use strict';

Date.prototype.toUnixTime = function() { return this.getTime()/1000|0 };
    Date.time = function() { return new Date().toUnixTime(); }

function generateAccessToken(imagePath) {
        return jwt.sign(imagePath, process.env.TOKEN_SECRET, { expiresIn: '300s' });
      }

app.post('/api/newtoken', (req, res) => {
    const token = generateAccessToken({ imagePath: req.body.imagePath});
    res.json({accessToken: token});
});

app.get('/api/getimage', authenticateToken, (req, res) => {
    res.send(true);
  });

app.post('/api/post/add', fileUpload({ createParentPath: true }),
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
        const array_of_allowed_files = ['jpg','JPG'];
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const files = req.files;
        if (!files.main_image) {
            return res.status(400).json({ errors: 'Main Image required' });
        }
        if (files.main_image.size > 1000000) {
            return res.status(400).json({ errors: 'Main Image size should be less than 1Mb' });
        }
        const file_extension = files.main_image.name.slice(
            ((files.main_image.name.lastIndexOf('.') - 1) >>> 0) + 2
        );
        if (!array_of_allowed_files.includes(file_extension)) {
            return res.status(400).json({ errors: 'Main Image foramt should be jpg' });
        }
        if (files.additional_images && files.additional_images.length > 5) {
            return res.status(400).json({ errors: 'Number of additional image Max 5' });
        }
        var additional_images_names = [];
        for (let i=0; i < files.additional_images.length; i++) {
            const file_extension = files.additional_images[i].name.slice(
                ((files.additional_images[i].name.lastIndexOf('.') - 1) >>> 0) + 2
            );
            if (!array_of_allowed_files.includes(file_extension)) {
                return res.status(400).json({ errors: 'additional Image foramt should be jpg' });
            }
            if (files.additional_images[i].size > 1000000) {
                return res.status(400).json({ errors: 'Additional Image size should be less than 1Mb' });
            }
            additional_images_names.push(files.additional_images[i].name);
          }

        if (!fs.existsSync('test.json')) {
            //create new file if not exist
            fs.closeSync(fs.openSync('test.json', 'w'));
        }
        fs.readFile('test.json', function (err, data) {
            var json = JSON.parse(data);
            referenceNumber = ('00000'+(json.length+1)).slice(-5);
            blog = {
                reference: referenceNumber,
                title: req.body.title,
                description: req.body.description,
                main_image: files.main_image.name,
                additional_images: additional_images_names,
                date_time: Date.time()
            }
            json.push(blog);
            fs.writeFile("test.json", JSON.stringify(json), function(err){
              if (err) throw err;
              console.log('The "data to append" was appended to file!');
              res.send(JSON.stringify(blog));
            } 
            );
        })
        
    });

app.get('/api/allposts', async (req, res) => {
    let rawdata = fs.readFileSync('test.json');
    let blogs = JSON.parse(rawdata);
    blogs.forEach(function (blog) {
        blog.title = slugify(blog.title, '_');
        blog.date_time = new Date(blog.date_time * 1000).toISOString();
    });
    res.send(blogs);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to ${port}...`))