let mongoose = require('mongoose'),
    schema = mongoose.Schema;

user = new schema({
    name: { type: String, trim: true, required: true },
    gender: { type: String, trim: true, required: true, enum: ['MALE', 'FEMALE'] },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    emailVerify: { type: Boolean },
    phoneNumber: { type: String, trim: true, unique: true, required: true },
    phoneVerify: { type: Boolean },
    alterNumber: { type: String, trim: true },
    address: {
        state: { type: String, trim: true },
        district: { type: String, trim: true },
        city: { type: String, trim: true },
        pincode: { type: String, trim: true }
    },
    profilrPic: { type: String, trim: true, default: 'no' },
    login: { type: String, trim: true, default: 'No' },
    otp: { type: String, required: true, trim: true }
}, { 'versionKey': false })


module.exports = mongoose.model('user_details', user);