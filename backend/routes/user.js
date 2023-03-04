const express = require("express")
const User = require('../models/User');
const fetchuser = require("../middlewares/fetchUser");
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

router.post('/profile/:email', async(req, res)=>{
    try{
        const query = { 'email': req.params.email };

        const exist = await User.find({ email: req.params.email });
        const newprofile = req.body;
        newprofile.email = req.params.email, newprofile.password = exist.password;

        await User.findOneAndUpdate(query, newprofile);
        res.status(201).send('updated successfully');
    } catch(err){
        res.status(400).send(err);
    }
});

module.exports = router