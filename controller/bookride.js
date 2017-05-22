let book = require('../helper/bookride');
let user = require('../helper/userdetail');
let offerRide = require('../helper/offerride');

module.exports = {
    bookride: (req, res) => {
        if (!req.body) res.status(422).send({ status: 422, err: 'Data Required' })
        else {
            user.emailfind({ 'email': req.body.email }).then(solve => {
                if (solve) {
                    let sendData = {
                        'name': req.body.name,
                        'ownername': req.body.ownername,
                        'email': req.body.email,
                        'pnumber': req.body.pnumber,
                        'user_pic': req.body.user_pic,
                        'owner_pic': req.body.owner_pic,
                        'source': req.body.source,
                        'destination': req.body.destination,
                        'date': req.body.date,
                        'dateString': req.body.dateString,
                        'day': req.body.day,
                        'cardType': req.body.cardType,
                        'cardNum': req.body.cardNum,
                        'car_number': req.body.car_number,
                        'price': req.body.price,
                        'ride_id': req.body.ride_id.toString()
                    }
                    console.log('Send Data: ', sendData);
                    book.bookRide(sendData).then(insert => {
                            offerRide.updateAvailable({ id: req.body.ride_id }).then(updat => {
                                    if (updat) res.status(200).send({ status: 200, data: 'Ride Booked' })
                                    else res.status(404).send({ status: 404, type: 2, err: 'This Ride Not Found' })
                                })
                                .catch(err => {
                                    console.log('Error Update: ', err);
                                    res.status(500).send({ status: 500, err: 'Internal Server Error' });
                                })
                        })
                        .catch(err => {
                            console.log('Insert Error: ', err);
                            res.status(500).send({ status: 500, err: 'Internal Server Error' })
                        })
                } else res.status(404).send({ status: 404, err: 'User Not Found' })
            }).catch(err => {
                console.log('Error1: ', err);
                res.status(500).send({ status: 500, err: 'Internal Server Error' })
            })
        }
    },

    showride: (req, res) => {
        if (!req.body) res.status(422).send({ status: 422, err: 'Data Required' })
        else {
            user.emailfind({ email: req.body.email })
                .then(emailFind => {
                    if (emailFind) {
                        book.findAllRide({ email: req.body.email })
                            .then(ride => {
                                if (ride) res.status(200).send({ status: 200, len: ride.length, data: ride })
                                else res.status(200).send({ status: 200, len: 0, data: null })
                            })
                            .catch(err => {
                                console.log('Error To Find', err);
                                res.status(500).send({ status: 500, err: 'Internal Server Error' })
                            })
                    } else res.status(404).send({ status: 404, type: 1, err: 'This Email Not Exist' })
                })
                .catch(err => {
                    console.log('Error 1', err);
                    res.status(500).send({ status: 500, err: 'Internal Server Error' });
                })
        }
    },

    passengerDetails: (req,res)=>{
        if(!req.body) res.status(422).send({status:422, err: 'Data Required'})
        else{
            user.emailfind({email: req.body.email})
            .then(solv=>{
                if(solv){
                    book.passengerDetails({id: req.body.id})
                    .then(sol=>{
                        if(sol) res.status(200).send({status:200, len: sol.length, data: sol})
                        else res.status(200).send({status: 200, len: 0, data: null})
                    })
                    .catch(err=>{
                        console.log('error2======= ', err);
                        res.status(500).send({status: 500, err: 'Internal Server Error'});
                    })
                }
                else res.status(404).send({status:404, err: 'User Not Found'})
            })
            .catch(error=>{
                console.log('error1==> ', error);
                res.status(500).send({status: 500, err: 'Internal Server Error'});
            })
        }
    },

    cancelRide: (req,res)=>{
        if(!req.body) res.status(422).send({status: 422, err: 'Provide Data'})
        else{
            let obj = {
                email: req.body.email,
                id: req.body.id
            }
            user.emailfind(obj)
            .then(ok=>{
                book.cancelRide(obj)
                .then(okdone=>{
                    if(okdone){
                        offerRide.rideCancelUpdate(obj)
                        .then(data=> res.status(200).send({status:200, data: 'Done'}))
                        .catch(e=>{
                            console.log('Error333333', e);
                            res.status(500).send({status: 500, err: 'Internal Server Error'});
                        })
                    }
                    else res.status(404).send({status: 404, err: 'Ride Not Found'})
                })
                .catch(er=>{
                    console.log('Error2000000000', er);
                    res.status(500).send({status: 500, err: 'Internal Server Error'});
                })
            })
            .catch(err=>{
                console.log('Error1000000000000', err);
                res.status(500).send({status:500, err: 'Internal Server Error'});
            })
        }
    }
}