let vechdetail = require('../models/offeride');
var mongoose = require('mongoose');

module.exports = {
    detailsInsert: (obj) => {
        return new Promise((resolve, reject) => {
            vechdetail.create(obj, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    },

    findRides: (obj) => {
        return new Promise((resolve, reject) => {
            vechdetail.find({ source: obj.source, destination: obj.destination, date: { $gte: obj.lowerDate, $lte: obj.upperDate } }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    updateAvailable: (obj) => {
        return new Promise((resolve, reject) => {
            obj.id = mongoose.Types.ObjectId(obj.id);
            vechdetail.findByIdAndUpdate({ _id: obj.id }, { $inc: { booked: 1, allow: -1 } }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    findAllRide: (obj) => {
        return new Promise((resolve, reject) => {
            vechdetail.find({ 'email': obj.email }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    deleteRide: (obj) => {
        return new Promise((resolve, reject) => {
            obj.id = mongoose.Types.ObjectId(obj.id);
            vechdetail.findByIdAndRemove({ _id: obj.id }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    rideCancelUpdate: (obj)=>{
        return new Promise((resolve, reject)=>{
            obj.id = mongoose.Types.ObjectId(obj.id);
            vechdetail.findByIdAndUpdate({_id: obj.id}, {$inc: {booked: -1, allow: 1}}, (err, data)=>{
                if(err) reject(err);
                else resolve(data);
            })
        })
    }
}