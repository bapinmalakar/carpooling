let book = require('../models/bookRide');

module.exports = {
    bookRide: (obj) => {
        return new Promise((resolve, reject) => {
            book.create(obj, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    findBookRide: (obj) => {
        return new Promise((resolve, reject) => {
            book.find({ ride_id: obj.rideId }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    findAllRide: (obj) => {
        return new Promise((resolve, reject) => {
            book.find({ email: obj.email }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    findRide: (obj) => {
        return new Promise((resolve, reject) => {
            book.find({ ride_id: obj.id }, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    },

    passengerDetails: (obj)=>{
        return new Promise((resolve, reject)=>{
            book.find({ride_id: obj.id}, (err,data)=>{
                if(err) reject(err)
                else resolve(data)
            })
        })
    },

    deleteRide: (obj) => {
        return new Promise((resolve, reject) => {
            book.remove({ ride_id: obj.id }, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    },

    cancelRide: (obj)=>{
        return new Promise((resolve, reject)=>{
            book.findOneAndRemove({email: obj.email, ride_id: obj.id}, (err,data)=>{
                if(err) reject(err);
                else resolve(data);
            })
        })
    }
}