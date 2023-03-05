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

router.get('/all', async(req, res)=>{
    try{
        const users = await User.find({});
        res.status(200).send(users);
    } catch(err){
        res.status(400).send(err);
    }
})


router.get('/similar/:email', async(req, res)=>{
    try{
        const me = await User.findOne({ email: req.params.email });
        const all = await User.find();
        let collect = [];
        
        let meinterests = me.interests, meregions = me.regions;
        for(let user of all){
            if(user.id != me.id){
                let userinterests = user.interests;
                const commonInterests = meinterests.filter(element => userinterests.includes(element));

                let userregions = user.regions;
                const commonRegions = meregions.filter(element=>userregions.includes(element));

                collect.push([commonInterests.length+commonRegions.length, user]);
            }
        }
        console.log(collect)
        collect.sort(sortFunction);
        function sortFunction(a, b){
            if(a[0] == b[0]) return 0;
            else return (a[0] < b[0]) ? -1:1;
        }
        collect.reverse();

        let tosend = [];
        for(let item of collect){
            item[1].interests = item[1].interests.slice(0, 4);
            tosend.push(item[1]);
        }
        
        res.status(200).send(tosend);
    } catch(err){
        res.status(400).send(err.message);
    }
})

router.post('/bulk', async(req, res)=>{
    try{
        const users = req.body;
        for(let user of users){
            const newuser = await User.create(user);
        }
        res.status(200).send('done');
    } catch(err){
        res.status(400).send(err.message);
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