const mongoose = require("mongoose");
const url = "mongodb+srv://darshan:12345@cluster0.potuzln.mongodb.net/travelapp?retryWrites=true&w=majority";


const connectToAtlas = () => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("connected..!!");
    }).catch((err) => {
        console.log("error....!!!!",err);
    })
}

module.exports = connectToAtlas
