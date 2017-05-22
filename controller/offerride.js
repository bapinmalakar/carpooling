let vech_details = require('../helper/offerride');
let user = require('../helper/userdetail');
let dateService = require('../services/calDate');
let nodeemail = require('../services/sendMail');
let book = require('../helper/bookride');

module.exports = {
    detailsInsert: (req, res) => {
        if (!req.body) res.status(422).send({ 'status': 422, 'err': 'Data Required' })
        else {
            let obj = {
                name: req.body.name,
                email: req.body.email,
                phone_number: req.body.phone_number,
                user_pic: req.body.user_pic,
                source: req.body.source,
                destination: req.body.destination,
                dateString: req.body.dateString,
                date: req.body.date,
                day: req.body.day,
                hour: req.body.hour,
                minute: req.body.minute,
                car_registration: req.body.car_registration,
                vechicle_type: req.body.vechicle_type,
                driving_lience: req.body.driving_lience,
                vechicle_image: req.body.image,
                allow: req.body.allow,
                booked: 0,
                price: req.body.price
            }
            console.log('Data Is: ', obj);
            user.emailfind(obj).then(solve => {
                    if (solve == null || solve.length <= 0) res.status(404).send({ status: 404, err: 'User Not Found' })
                    else {
                        vech_details.detailsInsert(obj)
                            .then(data => res.status(200).send({ status: 200, data: 'Successfully Saved Your Ride' }))
                            .catch(err => {
                                console.log('Err2222====', err);
                                res.status(500).send({ status: 500, err: 'Internal Server Error! Try Again' });
                            })
                    }
                })
                .catch(prob => {
                    console.log('Errro1111======', prob);
                    res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' })
                })
        }
    },

    findrides: (req, res) => {
        console.log('Run Functio');
        if (!req.body) res.status(422).send({ status: 422, err: 'Need Data' })
        else {
            user.emailfind({ 'email': req.body.email })
                .then(data => {
                    if (data == null || data.length <= 0) res.status(404).send({ status: 404, err: 'User Not Found' })
                    else {
                        console.log('Date is: ', req.body.date, ' Type: ', typeof req.body.date);
                        let obj = {
                            lowerDate: dateService.subtractHour(parseInt(req.body.date)),
                            upperDate: dateService.addHour(parseInt(req.body.date)),
                            source: req.body.source,
                            destination: req.body.dest
                        };
                        console.log('Search Query Data: ', obj);
                        vech_details.findRides(obj)
                            .then(result => {
                                console.log('Data: ', result);
                                let sendData = result.filter(dat => { return dat.allow > 0 });
                                console.log('Data : ', sendData);
                                res.status(200).send({ status: 200, data: sendData })
                            })
                            .catch(error => {
                                console.log('Error Find: ', error);
                                res.status(500).send({ status: 500, err: 'Internal Error' });
                            })
                    }
                })
                .catch(err => {
                    console.log('Errro---------', err);
                    res.status(500).send({ status: 500, err: 'Internal Server Error' })
                })
        }
    },

    findAllRide: (req, res) => {
        if (!req.body) res.status(422).send({ status: 422, err: 'Please Provide Data' })
        else {
            user.emailfind({ email: req.body.email })
                .then(emailFinf => {
                    if (emailFinf) {
                        vech_details.findAllRide({ email: req.body.email })
                            .then(vechFind => res.status(200).send({ status: 200, len: vechFind.length, data: vechFind }))
                            .catch(err => {
                                console.log('Error Second: ', err);
                                res.status(500).send({ status: 500, err: 'Internal Server Error' });
                            })
                    } else res.status(404).send({ status: 404, err: 'Account Not Found' })
                })
                .catch(err => {
                    console.log('First Error: ', err);
                    res.status(500).send({ status: 500, err: 'Internal Server Error' });
                })
        }
    },

    deleteFind: (req, res) => {
        console.log('Function Calll Server');
        if (!req.body) res.status(422).send({ status: 422, err: 'data Required' })
        else {
            console.log('Step1-->');
            book.findRide({ id: req.body.id })
                .then(data => {
                    console.log('Step2');
                    if (data == null || data.length <= 0) {
                        vech_details.deleteRide({ id: req.body.id })
                            .then(data => res.status(200).send({ status: 200, data: 'Ride Canceleed Successfully' }))
                            .catch(err => {
                                console.log('Error2----->', err);
                                res.status(500).send({ status: 500, err: 'Internal Server Error' })
                            })
                    } else {
                        console.log('Step3-->');
                        let obj = {};
                        obj.email = data.map(d => { return d.email });
                        console.log('Emails Are: ', obj.email);
                        let emailListString = obj.email[0];
                        for (let i = 1; i < (obj.email).length; i++) {
                            emailListString += ',' + obj.email[i];
                        }
                        console.log('Email String: ', emailListString);
                        obj = {
                            email: emailListString,
                            subject: 'LPU Carpooling Cancel Notifiaction',
                            msg: 'Owner Of Vechicle Cancel The Ride',
                            html_msg: '<h1>Vechicle Owner ' + data[0].ownername + 'Canceld The Ride Due To Some Reason</h1><h3>Ride Details: ' + data[0].car_number + '  Date: ' + data[0].dateString + '</h3>'
                        };
                        nodeemail(obj)
                            .then(send => {
                                console.log('Notification Send: ');
                                book.deleteRide({ id: req.body.id })
                                    .then(bookDel => {
                                        vech_details.deleteRide({ id: req.body.id })
                                            .then(done => res.status(200).send({ status: 200, data: 'Successfully Canceled' }))
                                            .catch(delerr => {
                                                console.log('OfferDelete Error: ', delerr);
                                                res.status(500).send({ status: 500, err: 'Internal Server Error' });
                                            })
                                    })
                                    .catch(err => {
                                        console.log('Error Book: ', err);
                                        res.status(500).send({ status: 500, err: 'Internal Server error' });
                                    })
                            })
                            .catch(senderr => {
                                console.log('Send Error: ', senderr);
                                res.status(403).send({ status: 403, err: 'Record Not Delete Beacuse We Are Unable To Notify User' })
                            })
                    }
                })
                .catch(err => {
                    console.log('Step: 3');
                    console.log('Error1---->>', err);
                    res.status(500).send({ status: 500, err: 'Internal Server Error' });
                })
        }
    }
}