let mongoose = require('mongoose');
let schema = mongoose.Schema;

let vechicle_details = new schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone_number: { type: String, required: true, trim: true },
    user_pic: { type: String, required: true },
    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    dateString: { type: String, required: true, trim: true },
    date: { type: Number, required: true },
    day: { type: String, required: true },
    hour: { type: Number, required: true },
    minute: { type: Number, required: true },
    car_registration: { type: String, required: true, trim: true },
    vechicle_type: { type: String, required: true, trim: true },
    driving_lience: { type: String, required: true, trim: true },
    vechicle_image: { type: String, required: true, trim: true },
    allow: { type: Number, required: true },
    booked: { type: Number, required: true },
    price: {type: Number, required: true}
});

module.exports = mongoose.model('vechicle_details', vechicle_details);