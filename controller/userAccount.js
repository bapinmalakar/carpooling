let User = require('../helper/userdetail');
let nodeEmail = require('../services/sendMail');

module.exports = {
    login: (req, res) => {
        if (!req.body) res.status(422).send({ 'status': 422, 'filed': 'body', 'err': 'Data Required' })
        else {
            User.login({ 'email': req.body.email, 'password': req.body.password }).then(data => {
                    console.log('Data: ', data);
                    if (data == null || data.length <= 0) res.status(404).send({ 'status': 404, 'err': 'User Not Found' })
                    else {
                        data.password = '';
                        data.otp == '';
                        if (data.emailVerify == true) res.status(200).send({ 'status': 200, 'data': data })
                        else res.status(401).send({ 'status': 401, 'err': 'Email Not Verified Yet!' })

                    }
                })
                .catch(err => res.status(500).send({ 'status': 500, 'err': 'Internal Server Error, Try Again' }))
        }
    },
    signup: (req, res, next) => {
        if (!req.body) res.status(422).send({ 'status': 422, 'err': 'Data Required' })
        else {
            User.emailfind({ 'email': req.body.email }).then(data => {
                    if (data == null || data.length <= 0) {
                        User.pnumberFind({ 'phoneNumber': req.body.phoneNumber }).then(phoneVali => {
                                if (phoneVali == null || phoneVali <= 0) {
                                    let otp = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
                                    let obj = {
                                        'name': req.body.name,
                                        'email': req.body.email,
                                        'phoneNumber': req.body.phoneNumber,
                                        'gender': req.body.gender,
                                        'password': req.body.password,
                                        'otp': otp,
                                        'emailVerify': false,
                                        'phoneVerify': false
                                    }
                                    User.demouserInsert(obj).then(isertData => {
                                        let sendData = {
                                            'email': obj.email,
                                            'subject': 'Account Verifying Code',
                                            'msg': 'Account Verifying 5-digit Code',
                                            'html_msg': '<h1>Use Below 5-Digit Code To Verify Account</h1><h3>' + obj.otp + '</h3>'
                                        }
                                        nodeEmail(sendData)
                                            .then(sendData => res.status(200).send({ 'status': 200, 'data': obj.otp }))
                                            .catch(sendErr => {
                                                User.demouserDelete({ email: obj.email }).then(delSuc => res.status(500).send({ 'status': 500, 'err': 'We Are Not Able To Send Verification Code, So Please Signup Again' }))
                                                    .catch(detErr => res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' }))
                                            })
                                    }).catch(insertErr => {
                                        console.log('insertErr-> ', insertErr);
                                        res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' })
                                    })
                                } else res.status(422).send({ status: 422, errType: 2, err: 'This Number Already Exists' })
                            })
                            .catch(phoneUnValid => res.status(500).send({ status: 500, err: 'Internal Server Error' }))
                    } else res.status(422).send({ 'status': 422, errType: 1, 'err': 'Email Already Exist' });
                })
                .catch(err => res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' }))
        }
    },

    userotpResend: (req, res) => {
        let otp = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        User.userotpResend({ 'email': req.body.email, 'otp': otp }).then(data => {
                if (data == null || data.length <= 0) res.status(404).send({ 'status': 404, 'err': 'User Not Found' })
                else {
                    let sendData = {
                        'email': req.body.email,
                        'subject': 'Account Verifying Code',
                        'msg': 'Account Verifying 5-digit Code',
                        'html_msg': '<h1>Use Below 5-Digit Code To Verify Account</h1><h3>' + otp + '</h3>'
                    }
                    nodeEmail(sendData).then(sendData => res.status(200).send({ 'status': 200, 'data': otp }))
                        .catch(sendErr => res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' }))
                }
            })
            .catch(err => res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' }))
    },

    signout: (req, res, next) => {
        User.signout({ 'email': req.body.email }).then(data => {
                if (data == null || data.length <= 0) res.status(404).send({ 'status': 404, 'err': 'User Not Found' })
                else res.status(200).send({ 'status': 200, 'data': 'Successfully Signout' })
            })
            .catch(err => res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' }))
    },

    resendOtp: (req, res, next) => {
        let otp = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        User.resendOtp({ 'email': req.body.email, 'otp': otp }).then(data => {
                if (data == null || data.length <= 0) res.status(404).send({ 'status': 404, 'err': 'User Not Found' })
                else {
                    let sendData = {
                        'email': req.body.email,
                        'subject': 'Account Verifying Code',
                        'msg': 'Password Reset Activation 5-digit Code',
                        'html_msg': '<h1>Use Below 5-Digit Code To Verify Account</h1><h3>' + otp + '</h3>'
                    }
                    nodeEmail(sendData).then(sendData => res.status(200).send({ 'status': 200, 'data': otp }))
                        .catch(sendErr => res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' }))
                }
            })
            .catch(err => res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' }))
    },

    userVerifyOtp: (req, res, next) => {
        User.demouserVerify({ 'email': req.body.email, 'otp': req.body.otp }).then(data => {
                if (data == null || data.length <= 0) res.status(404).send({ 'status': 404, 'err': 'Invalid OTP' })
                else {
                    User.demouserDelete({ 'email': req.body.email })
                        .then(sol => {
                            let obj = {
                                'name': data.name,
                                'email': data.email,
                                'phoneNumber': data.phoneNumber,
                                'gender': data.gender,
                                'password': data.password,
                                'otp': 'no',
                                'emailVerify': true,
                                'phoneVerify': false
                            }
                            data.password = '';
                            data.otp = '';
                            User.insertDetails(obj).then(done => res.status(200).send({ 'status': 200, 'data': data }))
                                .catch(error => res.status(500).send({ status: 500, err: 'Internal Error' }))
                        })
                        .catch(prob => res.status(500).send({ status: 500, err: 'Internal Error' }))
                }
            })
            .catch(err => {
                console.log('Error: ', err);
                res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' });
            })
    },

    passwordOtp: (req, res, next) => {
        User.passwordOtp({ 'email': req.body.email, 'otp': req.body.otp }).then(data => {
                if (data == null || data.length <= 0) res.status(404).send({ 'status': 404, 'err': 'Invalid Code' })
                else res.status(200).send({ 'status': 200, 'data': 'Ok' })
            })
            .catch(err => res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' }))
    },

    forPasswordUpdate: (req, res, next) => {
        User.forPasswordUpdate({ 'email': req.body.email, 'otp': req.body.otp, 'password': req.body.password })
            .then(data => {
                if (data == null || data.length <= 0) res.status(404).send({ 'status': 404, 'err': 'User Not Found' })
                else res.status(200).send({ 'status': 200, 'data': 'Ok' })
            })
            .catch(err => {
                console.log('Error--> ', err);
                res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' })
            })
    },

    pnumberUpdate: (req, res) => {
        if (!req.body) res.status(422).send({ status: 422, err: 'Dta Required' })
        else {
            User.emailfind({ 'email': req.body.email }).then(emailFind => {
                    if (emailFind) {
                        User.phoneUpdateFind({ phoneNumber: req.body.pnumber, email: req.body.email }).then(pcheck => {
                                if (pcheck) res.status(422).send({ status: 422, err: 'Number Already Exist' })
                                else {
                                    User.phoneNumberUpdate({ 'email': req.body.email, 'phoneNumber': req.body.pnumber, 'alterNumber': req.body.alterNumber })
                                        .then(updat => res.status(200).send({ status: 200, data: 'Success' }))
                                        .catch(err => {
                                            console.log('Update Error: ', err);
                                            res.status(500).send({ status: 500, err: 'Internal Error' });
                                        })
                                }
                            })
                            .catch(err => {
                                console.log('Error P Check: ', err);
                                res.status(500).send({ status: 500, err: 'Internal Server Error' })
                            })
                    } else res.status(404).send({ status: 404, err: 'Your Account Not Found' })
                })
                .catch(err => {
                    {
                        console.log('Error Email Find: ', err);
                        res.status(500).send({ status: 500, err: 'Internal Error' });
                    }
                })
        }
    }
}