const express = require("express")
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

router.post('/create', async(req, res)=>{
    try{
        const data = req.body;
        const newtrip = await Trip.create(data);
        res.status(200).send(newtrip);
    } catch(err){
        res.status(400).send(err);
    }
});

module.exports = router;