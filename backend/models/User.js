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
        default: null,
    },
    age:{
        type: Number,
        default: 0,
    },
    gender:{
        type: String,
        default: null,
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
        default: null,
    },
    to_date:{
        type: Date,
        default: null,
    },
    latitude: {
        type: Number,
        default: 0,
    },
    longitude:{
        type: Number,
        default: 0,
    },
    age_verified:{
        type: Boolean,
        default: false,
    },
    date_created : {
        type : Date,
        default : Date.now
    }
});
const users = mongoose.model("users", UsersSchema);
users.createIndexes();
module.exports = users;