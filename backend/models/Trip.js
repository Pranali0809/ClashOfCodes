const mongoose = require("mongoose")
const { Schema } = mongoose;

const TripsSchema = new Schema({
    rsvped_users:[{
        type: String,
    }],
    host_user_id: {
        type: String,
        default: null
    },
    host_username:{
        type: String,
        default: null,
    },
    womens_only:{
        type: Boolean,
        default: false,
    },
    location: {
        type: String,
        default: null,
    },
    region: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null
    },
    estimated_budget:{
        type: Number,
        default: null,
    },
    date:{
        type: Date,
        default: null,
    },
    image_url:{
        type: String,
        default: null
    }
});

const trips = mongoose.model("trips", TripsSchema);

module.exports = trips;