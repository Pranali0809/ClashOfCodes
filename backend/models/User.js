const mongoose = require("mongoose")
const { Schema } = mongoose;

const UsersSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique: true
    },
    password : {
        type : String,
        required : true
    },
    phone:{
        type: String,
    },
    age:{
        type: Number
    },
    gender:{
        type: String,
    },
    interests:[{
        type: String,
    }],
    ratings:[{
        type: Number,
    }],
    regions:[{
        type: String,
    }],
    from_date:{
        type: Date,
    },
    to_date:{
        type: Date,
    },
    latitude: {
        type: Number,
    },
    longitude:{
        type: Number
    },
    date_created : {
        type : Date,
        default : Date.now
    }
});
const users = mongoose.model("users", UsersSchema);
users.createIndexes();
module.exports = users;