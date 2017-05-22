let path = require('path');
let fs = require('fs');

module.exports = {
    indexpage: (req, res) => {
        res.redirect('/index.html');
    },

    offerride: (req, res) => {
        res.sendFile(path.resolve(__dirname, '../view/offer a ride.html'));
    },

    login: (req, res) => {
        res.redirect('/login.html');
    },

    landingpage: (req, res) => {
        res.redirect('/landingpage.html');
    }
}