const express = require("express")
const User = require('../models/User');
const fetchuser = require("../middlewares/fetchUser");
const router = express.Router()

router.post('/', async(req, res)=>{
    try{
        const recId = req.body.receiver_id, rating = req.body.rating;

        const user = await User.findById(recId);
        user.ratings.push(rating);
        await user.save();
        res.status(200).send(user);
    } catch(err){
        res.status(400).send(err.message);
    }
});

router.get('/:userid', async(req, res)=>{
    try{
        const userid = req.params.userid;

        const user = await User.findById(userid);
        const ratings = user.ratings;

        let sum = 0;
        for(let i = 0; i < ratings.length; i++){
            sum += ratings[i];
        }

        res.status(200).send({ rating: sum/ratings.length });
    } catch(err){
        res.status(400).send(err.message);
    }
});

module.exports = router;