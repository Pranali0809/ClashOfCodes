const express = require("express")
const path = require('path');
const multer = require('multer');
const Trip = require('../models/Trip');
const fetchuser = require("../middlewares/fetchUser");
const router = express.Router()

router.get('/', async(req, res)=>{
    try{
        const trips = await Trip.find({});
        res.status(200).send(trips);
    } catch(err){
        res.status(400).send();
    }
});

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

router.post('/create',async(req, res, next)=>{
    upload(req,res,(err)=> {  
        if(err) {
            res.send(err)
        }
        else {
            next();
        }
    })
},async(req, res)=>{
    try{
        const data = req.body;
        delete data.image;
        // console.log(req.file);
        data.image_url = req.file.path;
        const newtrip = await Trip.create(data);
        res.status(200).send(newtrip);

    } catch(err){
        res.status(400).send(err);
    }
});

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