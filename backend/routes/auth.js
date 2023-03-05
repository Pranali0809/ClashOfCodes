const express = require("express")
const router = express.Router()
const users = require("../models/User")
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs")
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fetchuser = require("../middlewares/fetchUser");

const JWT_SECRET = "HelloRashid"

async function sendMail(user) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'mprcashflow@gmail.com',
            pass: 'nzuymdrknswvchmm',
        },
    });


    const mailOptions = {
        from: 'mprcashflow@gmail.com',
        to: user.email,
        subject: 'There is some activity in the chat room!',
        text: `HI ${user.name}`,
        attachments: [
            {
                content: `People are plannning to meet in the nearest chat room`,
            },
        ],
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
}

function getDist(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371;

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusKm * c;
    return distance;
    }

    function deg2rad(deg) {
    return deg * (Math.PI / 180)
    }

// Create a user using : POST "/api/auth/ Doesnt require auth"
router.post("/createUser", [
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('password', 'Password too short').isLength({ min: 3 })
], async (req, res) => {
    // checking validation and errors
    var success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    // secured password  = hash(password + salt)
    const salt = await bcrypt.genSalt(10);
    let secPass = await bcrypt.hash(req.body.password, salt);
    try {
        // checking if user already exist
        let newuser = await users.findOne({ email: req.body.email })
        if (newuser) {
            return res.status(400).json({success, error: "This user already exist" });
        }
        // It automatically create a collection in mongodb unlike SQL
        // creating a new user
        newuser = await users.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user: {
                id: newuser.id,
            }
        }
        success = true;
        const authToken = jwt.sign(data, JWT_SECRET);
        res.send({success, authToken })
    } catch (error) {
        res.status(500).send("Error has occured");
    }
})

// Authenticate a user
router.post("/login", [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can not be blank').isLength({ min: 1 })
], async (req, res) => {
    // checking validation and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let success = false;
        let user = await users.findOne({ email })
        if (!user) return res.status(500).json({success, error: "Please try to login with correct credential" });
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) return res.status(500).json({success, error: "Please try to login with correct credential" });
        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;

        const lat = req.body.latitude, long = req.body.longitude;
        if(lat && long){
            let allusers = await users.find();
            for(let user of allusers){
                const ulat = user.latitude, ulong = user.longitude;
                console.log(typeof ulat)
                const d = getDist(ulat, ulong, lat, long);
                console.log(d);
                if(d <= 100){
                    sendMail(user);
                }
            }
        }
        res.send({ success, authToken, userId: user.id, email: user.email })
    } catch (error) {
        res.status(500).send("Error has occured " + error);
    }

})

router.post("/getUser", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await users.findById(userId).select("-password")
        res.send(user);
    } catch (error) {
        res.status(500).send("some error occured " + error);
    }
})

module.exports = router