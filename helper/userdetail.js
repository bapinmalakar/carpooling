let details = require('../models/user');
let demo_user = require('../models/demoUser');

module.exports = {
    emailfind: (obj) => {
        return new Promise((resolve, reject) => {
            details.findOne({ 'email': obj.email }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
    },

    pnumberFind: (obj) => {
        return new Promise((resolve, reject) => {
            details.findOne({ 'phoneNumber': obj.phoneNumber }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    login: (obj) => {
        return new Promise((resolve, reject) => {
            details.findOneAndUpdate({ 'email': obj.email, 'password': obj.password }, { $set: { 'login': 'Yes' } }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
    },

    verifyEmail: (obj) => {
        return new Promise((resolve, reject) => {
            details.findOneAndUpdate({ 'email': obj.email }, { $set: { 'verifyEmail': true } }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
    },

    userotpResend: (obj) => {
        return new Promise((resolve, reject) => {
            demo_user.findOneAndUpdate({ 'email': obj.email }, { $set: { 'otp': obj.otp } }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    signout: (obj) => {
        return new Promise((resolve, reject) => {
            details.findOneAndUpdate({ 'email': obj.email }, { $set: { 'login': 'No' } }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
    },

    insertDetails: (obj) => {
        return new Promise((resolve, reject) => {
            details.create({
                    'name': obj.name,
                    'email': obj.email,
                    'phoneNumber': obj.phoneNumber,
                    'gender': obj.gender,
                    'password': obj.password,
                    'otp': obj.otp,
                    'emailVerify': true,
                    'phoneVerify': false
                },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                })
        })
    },

    resendOtp: (obj) => {
        return new Promise((resolve, reject) => {
            details.findOneAndUpdate({ 'email': obj.email }, { $set: { 'otp': obj.otp } }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    verifyNumber: (obj) => {
        return new Promise((resolve, reject) => {
            details.findOneAndUpdate({ 'email': obj.email, 'phoneNumber': obj.phoneNumber }, { $set: { 'verifyNumber': true } }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    userVerifyOtp: (obj) => {
        return new Promise((resolve, reject) => {
            demo_user.findOne({ 'email': obj.email, 'otp': obj.otp }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    passwordOtp: (obj) => {
        return new Promise((resolve, reject) => {
            details.findOne({ 'email': obj.email, 'otp': obj.otp }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })

    },

    forPasswordUpdate: (obj) => {
        return new Promise((resolve, reject) => {
            details.findOneAndUpdate({ 'email': obj.email, 'otp': obj.otp }, { $set: { 'password': obj.password, 'otp': 'No' } }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    deleteUser: (obj) => {
        return new Promise((resolve, reject) => {
            details.findOneAndRemove({ 'email': obj.email }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    phoneUpdateFind: (obj) => {
        return new Promise((resolve, reject) => {
            details.findOne({ phoneNumber: obj.phoneNumber, email: { $ne: obj.email } }, (err, data) => {
                console.log('Data: ', data);
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    profilePicUpload: (obj) => {
        return new Promise((resolve, reject) => {
            details.findOneAndUpdate({ 'email': obj.email }, { $set: { 'profilrPic': obj.url } }, (err, data) => {
                console.log('Data: ', data);
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    phoneNumberUpdate: (obj) => {
        return new Promise((resolve, reject) => {
            details.findOneAndUpdate({ 'email': obj.email }, { $set: { 'phoneNumber': obj.phoneNumber, 'alterNumber': obj.alterNumber } }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    demouserInsert: (obj) => {
        return new Promise((resolve, reject) => {
            demo_user.create(obj, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    demouserDelete: (obj) => {
        return new Promise((resolve, reject) => {
            demo_user.findOneAndRemove({ email: obj.email }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    demouserVerify: (obj) => {
        return new Promise((resolve, reject) => {
            demo_user.findOne({ 'email': obj.email, 'otp': obj.otp }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    }
}