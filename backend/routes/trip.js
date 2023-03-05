const express = require("express")
const path = require('path');
const multer = require('multer');
const Trip = require('../models/Trip');
const fetchuser = require("../middlewares/fetchUser");
const router = express.Router()

const { upload } = require('../service/upload.service')
const { uploadToCloudinary } = require("../service/upload.service");
const { ErrorHandler } = require('../utils/errorHandler')
const { bufferToDataURI } = require('../utils/file')

router.get('/', async(req, res)=>{
    try{
        const trips = await Trip.find({});
        res.status(200).send(trips);
    } catch(err){
        res.status(400).send();
    }
});

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
//     }
// })
 
// const upload = multer({ 
//     storage: storage
// }).single('image');

// router.post('/create',async(req, res, next)=>{
//     upload(req,res,(err)=> {  
//         if(err) {
//             res.send(err)
//         }
//         else {
//             next();
//         }
//     })
// },async(req, res)=>{
//     try{
//         const data = req.body;
//         delete data.image;
//         // console.log(req.file);
//         data.image_url = req.file.path;
//         const newtrip = await Trip.create(data);
//         res.status(200).send(newtrip);

//     } catch(err){
//         res.status(400).send(err);
//     }
// });

router.post('/create', upload.single('image'), async(req, res, next)=>{
    try{
        const data = req.body;
        const {file} = req;

        if(file){
            const fileFormat = file.mimetype.split('/')[1]
            const { base64 } = bufferToDataURI(fileFormat, file.buffer)
            const imageDetails = await uploadToCloudinary(base64, fileFormat);

            data.image_url = imageDetails.url;
        }
        const newtrip = await Trip.create(data);
        res.status(200).send(newtrip);
    }catch(err){
        res.status(400).send(err.message);
    }
})

router.post('/rsvp', async(req, res)=>{
    try{
        const tripid = req.body.trip_id;
        const userid = req.body.user_id;

        const trip = await Trip.findById(tripid);
        trip.rsvped_users.push(userid);
        await trip.save();
        res.status(200).send(trip);
    } catch(err){
        res.status(400).send(err.message);
    }
});

router.post('/drsvp', async(req, res)=>{
    try{
        const tripid = req.body.trip_id;
        const userid = req.body.user_id;

        const trip = await Trip.findById(tripid);
        const index = trip.rsvped_users.indexOf(userid);
        if (index > -1) { 
            trip.rsvped_users.splice(index, 1); 
        }
        await trip.save();

        res.status(200).send();
    } catch(err){
        res.status(400).send(err.message);
    }
});

router.get('/rsvpcount/:tripid', async(req, res)=>{
    try{
        const tripid = req.params.tripid;

        const trip = await Trip.findById(tripid);
        // console.log(trip)
        res.status(200).send({ count: trip.rsvped_users.length });

    } catch(err){
        res.status(400).send(err.message);
    }
})



// router.post('/create',async(req, res)=>{
//     try{
//         console.log(req.body)
//         const data = req.body;
//         delete data.image;
//         // console.log(req.file);
//         // data.image_url = req.file.filename;
//         const newtrip = await Trip.create(data);
//         res.status(200).send(newtrip);

//     } catch(err){
//         res.status(400).send(err.message);
//     }
// });

// router.get('/upload',(req,res) => {
//     try{
//         res.send("hello");
//         res.sendFile(__dirname,"../uploads/"+req.query.filename);
//     } catch(err){
//         res.status(400).send(err);
//     }
// });

module.exports = router;