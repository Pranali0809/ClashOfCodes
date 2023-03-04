const express = require("express")
const User = require('../models/User');
const fetchuser = require("../middlewares/fetchUser");
const path = require('path');
const multer = require('multer');
const axios = require('axios');
const router = express.Router()

router.get('/', async(req, res)=>{
    try{
        const email = req.query.email;
        const details = await User.findOne({ email });
        res.status(200).send(details);
    } catch(err){
        res.status(400).send(err);
    }
});

// router.post('/profile/:email', async(req, res)=>{
//     try{
//         const query = { 'email': req.params.email };

//         const exist = await User.find({ email: req.params.email });
//         const newprofile = req.body;
//         newprofile.email = req.params.email, newprofile.password = exist.password, newprofile.filled_profile = exist.filled_profile;

//         await User.findOneAndUpdate(query, newprofile);
//         res.status(201).send('updated successfully');
//     } catch(err){
//         res.status(400).send(err);
//     }
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
    }
})
 
const upload = multer({ 
    storage: storage
}).single('image');

router.post('/profile/:email', async(req, res, next)=>{
    upload(req,res,(err)=> {  
        if(err) {
            res.send(err)
        }
        else {
            next();
        }
    })
}, async(req, res)=>{
    try{
        const query = { 'email': req.params.email };

        const exist = await User.find({ email: req.params.email });
        const newprofile = req.body;
        newprofile.email = req.params.email, newprofile.password = exist.password, newprofile.filled_profile = exist.filled_profile;

        if(exist.age_verfified == false && req.file){
            const options = {
                method: 'POST',
                url: 'https://age-detector.p.rapidapi.com/age-detection',
                headers: {
                  'content-type': 'application/json',
                  'X-RapidAPI-Key': 'e702aefc09msh2dba70ca5c831b2p16b792jsn65b650b88fe9',
                  'X-RapidAPI-Host': 'age-detector.p.rapidapi.com'
                },
                data: `{"url":"${req.file.path}"}`
            };

            axios.request(options).then(function (response) {
                console.log(response.data);
            }).catch(function (error) {
                console.error(error);
            });
        }

        await User.findOneAndUpdate(query, newprofile);
        res.status(201).send('updated successfully');
    } catch(err){
        res.status(400).send(err);
    }
});

// router.post('/profile/:email', async(req, res)=>{
//     try{
//         const query = { 'email': req.params.email };

//         const exist = await User.find({ email: req.params.email });
//         const newprofile = req.body;
//         newprofile.email = req.params.email, newprofile.password = exist.password, newprofile.filled_profile = exist.filled_profile;

//         await User.findOneAndUpdate(query, newprofile);
//         res.status(201).send('updated successfully');
//     } catch(err){
//         res.status(400).send(err);
//     }
// });

module.exports = router