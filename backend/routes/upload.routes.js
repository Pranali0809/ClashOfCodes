const { Router } = require('express')
const { upload } = require('../service/upload.service')
const { uploadToCloudinary } = require("../service/upload.service");
const { ErrorHandler } = require('../utils/errorHandler')
const { bufferToDataURI } = require('../utils/file')

const User = require('../models/User');
const fetchuser = require("../middlewares/fetchUser");
const path = require('path');
const multer = require('multer');
const axios = require('axios');

const router = Router()

router.post('/profile/:email', upload.single('image'), async (req, res, next) => {
    try {
        const query = { 'email': req.params.email };

        const exist = await User.findOne({ email: req.params.email });
        const newprofile = req.body;
        newprofile.email = req.params.email, newprofile.password = exist.password, newprofile.filled_profile = exist.filled_profile;
        
        const { file } = req

        if(exist.age_verified == false && file){
            const fileFormat = file.mimetype.split('/')[1]
            const { base64 } = bufferToDataURI(fileFormat, file.buffer)
            const imageDetails = await uploadToCloudinary(base64, fileFormat)

            const options = {
                method: 'POST',
                url: 'https://age-detector.p.rapidapi.com/age-detection',
                headers: {
                  'content-type': 'application/json',
                  'X-RapidAPI-Key': 'e702aefc09msh2dba70ca5c831b2p16b792jsn65b650b88fe9',
                  'X-RapidAPI-Host': 'age-detector.p.rapidapi.com'
                },
                data: `{"url":"${imageDetails.url}"}`
            };

            await axios.request(options).then(function (response) {
                console.log(response.data);
            }).catch(function (error) {
                console.error(error);
            });
        }

        await User.findOneAndUpdate(query, newprofile);
        res.status(201).send('updated successfully');

  
      
  
    //   res.json({
    //     status: 'success',
    //     message: 'Upload successful',
    //     data: imageDetails,
    //   })
    } catch (err) {
        res.status(400).send(err.message);
    }
  })

module.exports = router