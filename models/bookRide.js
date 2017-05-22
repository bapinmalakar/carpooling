let mongoose = require('mongoose');
let schema = mongoose.Schema;

let modal = new schema({
    name: { type: String, required: true, trim: true },
    ownername: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    pnumber: { type: String, required: true, trim: true },
    user_pic: { type: String, required: true, trim: true },
    owner_pic: { type: String, required: true, trim: true },
    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    dateString: { type: String, required: true, trim: true },
    day: { type: String, required: true, trim: true },
    cardType: { type: String, required: true, trim: true },
    cardNum: { type: String, required: true, trim: true },
    car_number: { type: String, required: true, trim: true },
    price: {type: Number, required: true},
    ride_id: { type: String, required: true }
}, { versionKey: false })

module.exports = mongoose.model('book_ride_details', modal);