let express = require('express'),
    router = express.Router(),
    bodyparser = require('body-parser'),
    userDetail = require('../controller/userAccount'),
    pages = require('../controller/viewpages'),
    images = require('../controller/imagesHandel'),
    vechicle_details = require('../controller/offerride'),
    ridebook = require('../controller/bookride');
let cors = require('cors');

router.use(bodyparser());
router.use(cors());

// page routing..
router.get('/', pages.indexpage);
router.get('/offerride', pages.offerride);
router.get('/landing', pages.landingpage);
router.get('/login', pages.login);

router.post('/login', userDetail.login);
router.post('/register', userDetail.signup);
router.post('/resendotp', userDetail.userotpResend);
router.post('/signout', userDetail.signout);
router.post('/sendotp', userDetail.resendOtp);
router.post('/verifyotp', userDetail.userVerifyOtp);
router.post('/passverify', userDetail.passwordOtp);
router.post('/resetpassword', userDetail.forPasswordUpdate);
router.post('/pupload', images.profileImage);
router.post('/findmyride', vechicle_details.findrides);
router.post('/ridesave', vechicle_details.detailsInsert);
router.post('/ridebook', ridebook.bookride);
router.post('/updatenumber', userDetail.pnumberUpdate);
router.post('/showride', ridebook.showride);
router.post('/offerridelist', vechicle_details.findAllRide);
router.post('/cancelofferride', vechicle_details.deleteFind);
router.post('/passengerdetails', ridebook.passengerDetails);
router.post('/cancel', ridebook.cancelRide);


module.exports = router;