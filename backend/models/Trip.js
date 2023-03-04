const mongoose = require("mongoose")
const { Schema } = mongoose;

const TripsSchema = new Schema({
    rsvped_users:[{
        type: String,
    }],
    host_user_id: String,
    location: String,
    region: String,
    description: String,
    image_url: String,
});

const trips = mongoose.model("trips", TripsSchema);

module.exports = trips;