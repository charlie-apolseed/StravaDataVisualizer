const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema(
    {
        id: {type: Number, required: true},
        activity_name : {type: String, required: false},
        distance : {type: Number, required: false},
        avg_heartrate : {type: Number, required: false},
        max_heartrate: {type: Number, required: false},
        duration : {type: Number, required: false},
        map_info : {type: JSON, required: false},
        sport_type: {type: String, required: false},
    }, {timestamps: true}
);

const Ride = mongoose.model('Ride', activitySchema);
module.exports = Ride;