const auth = require("../middlewares/fetchUser");
const router = require("express").Router();
const Chatroom = require('../models/Chatroom');
const { catchErrors } = require("../handlers/errorHandlers");


router.get("/", auth, catchErrors(async (req, res) => {
    const chatrooms = await Chatroom.find({});
  
    res.json(chatrooms)
}));

router.post("/", auth, catchErrors(async (req, res) => {
    const { name } = req.body;
  
    const nameRegex = /^[A-Za-z\s]+$/;
  
    if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";
  
    const chatroomExists = await Chatroom.findOne({ name });
  
    if (chatroomExists) throw "Chatroom with that name already exists!";
  
    const chatroom = new Chatroom({
      name,
    });
  
    await chatroom.save();
  
    res.json({
      message: "Chatroom created!",
    });
  }));

module.exports = router;
