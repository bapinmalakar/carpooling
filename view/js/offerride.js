$(document).ready(() => {
    console.log('Script Running...');
    let lastRideIndex = 0;
    let nameRegx = new RegExp('^[a-zA-Z0-9 ]+$');
    setAlertDivText('Wait,Loading Information....');
    if (!localStorage.getItem('car_pol_user_details')) {
        swal({
            title: 'Not Accessable',
            text: 'Please Login',
            type: "error"
        })
        window.location.href = "http://localhost:3000/login";
    }
    let userDetails = JSON.parse(localStorage.getItem('car_pol_user_details'));
    console.log('User details: ', userDetails);
    $('#username').text(userDetails.name.toUpperCase());
    if (userDetails.profilrPic == undefined || userDetails.profilrPic == 'no') {
        $('#profileImage').attr('src', './images/Lovely_Professional_University_Seal.jpg');
        setAlertDivText('');
    } else {
        $('#profileImage').attr('src', userDetails.profilrPic);
        $('#vechicle_details_model_wait').hide();
        setAlertDivText('');
    }

    offerRideList('d', (err, data) => {
        if (err) console.log('Error Due To Load Offer Data List')
        else {
            console.log('Offer Data List Successfully');
            offerRideNotification('d', (err1, data) => {
                if (err1) console.log('Error Due To Load Notification');
                else console.log('Notification Load');
            })
        }
    })
    filepicker.setKey("Ap8ETk3FYQOlT98dMyXpNz");
    $('#pupload').click(() => {
        filepicker.pick({
                mimetype: 'image/*',
                /* Images only */
                maxSize: 1024 * 1024 * 5,
                /* 5mb */
                imageMax: [1500, 1500],
                /* 1500x1500px */
                cropRatio: 1 / 1,
                /* Perfect squares */
                container: 'window',
                services: ['*'] /* All available third-parties */
            }, function(blob) {
                setAlertDivText('Wait, We Are In Process');
                $.post('http://localhost:3000/pupload', { 'email': userDetails.email, 'purl': blob.url }, (response) => {
                        userDetails.profilrPic = blob.url;
                        $('#profileImage').attr('src', blob.url);
                        localStorage.setItem('car_pol_user_details', JSON.stringify(userDetails))
                        setAlertDivText('');
                    })
                    .fail(err => {
                        if (err.responseJSON.status == 500)
                            setAlertDivText(err.responseJSON.err + '! Try Again');
                        else if (err.responseJSON.status == 404)
                            setAlertDivText(err.responseJSON.err);
                        else setAlertDivText('Connection Error! Try Again')
                    })
            },
            function(FPError) { // error function for filepicker
                console.log('Upload Error: ', FPError);
                setAlertDivText('Error! Only Images and Maxsixe: 5MB Either Check Internet Connection')
            });
    })



    function setAlertDivText(msg) {
        if (msg == '') {
            $('#alertDiv').text(msg);
            $('#alertDiv').hide();
        } else {
            $('#alertDiv').show();
            $('#alertDiv').text(msg);
        }
    }


    $('#offerModelShow').click(() => {
        if (userDetails.profilrPic == 'no' || userDetails.profilrPic == '' || typeof userDetails.profilrPic == undefined) {
            $('#offerModal').ready(() => {
                $("#offerModal .close").click();
                sweetAlert('Warning', 'Upload Profile Piture Before Offer A Ride');
            })
        } else {
            $('#offerDate').attr('min', new Date().toISOString().substring(0, 10));
            setAlertDivText('');
        }
    });
    // Car Register Model
    $('#userName').text(userDetails.name);
    $('#userNumber').text(userDetails.phoneNumber);
    $('#useremail').text(userDetails.email);
    $('#offerSubmit').attr('disabled', true);
    $('#vechicle_details_model_wait').hide();
    let offerSource = false;
    let offerDest = false;
    let offerDate = false;
    let rideHour = false;
    let rideMinute = false;
    let drivingLience = '';
    let carRegis = false;
    let price = true;
    let vechType = '';
    let vechImage = '';


    function offerValidCheck() {
        if (offerSource == true && offerDate == true && offerDate == true && rideHour == true && rideMinute == true && price == true && carRegis == true) {
            if (vechType != '') {
                $('#typeText').text('');
                if (drivingLience != '') {
                    $('#drivingLienceText').text('');
                    if (vechImage != '') {
                        $('#vechicleImageText').text('');
                        $('#offerSubmit').attr('disabled', false);
                    } else {
                        $('#vechicleImageText').text('Upload Vecheicle Image');
                        $('#offerSubmit').attr('disabled', true);
                    }
                } else {
                    $('#drivingLienceText').text('Upload Driving Lience');
                    $('#offerSubmit').attr('disabled', true);
                }
            } else {
                $('#typeText').text('Select Vecheicle Type');
                $('#offerSubmit').attr('disabled', true);
            }
        } else {
            $('#offerSubmit').attr('disabled', true);
        }
    }

    $('#offerSource').keyup(() => {
        if (nameRegx.test($('#offerSource').val())) {
            offerSource = true;
            $('#sourceText').text('');
            offerValidCheck();
        } else {
            offerSource = false;
            $('#sourceText').text('Enter Valid Source');
            offerValidCheck();
        }
    });
    $('#offerSource').focusout(() => {
        if ($('#offerSource').val() == '') {
            offerSource = false;
            $('#sourceText').text('Enter Source');
            offerValidCheck();
        } else {
            if (nameRegx.test($('#offerSource').val())) {
                offerSource = true;
                $('#sourceText').text('');
                offerValidCheck();
            } else {
                offerSource = false;
                $('#sourceText').text('Enter Valid Source');
                offerValidCheck();
            }
        }
    });

    $('#offerDest').keyup(() => {
        if (nameRegx.test($('#offerDest').val())) {
            offerDest = true;
            $('#dstinationText').text('');
            offerValidCheck();
        } else {
            offerDest = false;
            $('#dstinationText').text('Enter Valid Destination');
            offerValidCheck();
        }
    });
    $('#offerDest').focusout(() => {
        if ($('#offerDest').val() == '') {
            offerSource = false;
            $('#destinationText').text('Enter Destination');
            offerValidCheck();
        } else {
            if (nameRegx.test($('#offerDest').val())) {
                offerSource = true;
                $('#dstinationText').text('');
                offerValidCheck();
            } else {
                offerSource = false;
                $('#dstinationText').text('Enter Valid Destination');
                offerValidCheck();
            }
        }
    });

    $('#offerDate').focusout(() => {
        console.log('Date', $('#offerDate').val());
        if ($('#offerDate').val() == '') {
            $('#offerDateText').text('Select Date');
            offerDate = false;
            offerValidCheck();
        } else {
            $('#offerDateText').text('');
            offerDate = true;
            offerValidCheck()
        }
    })

    $('#rideHour').focusout(() => {
        if ($('#rideHour').val() == 'Hour') {
            $('#rideHourText').text('Select Hour');
            rideHour = false;
            offerValidCheck();
        } else {
            $('#rideHourText').text('');
            rideHour = true;
            offerValidCheck();
        }
    });

    $('#rideMinute').click(() => {
        console.log('Ok');
        if ($('#rideHour').val() == 'Hour') {
            $('#rideHourText').text('Select Hour');
            rideHour = false;
            offerValidCheck();
        } else {
            $('#rideHourText').text('');
            rideHour = true;
            offerValidCheck();
        }
    });
    $('#rideMinute').focusout(() => {
        if ($('#rideHour').val() == 'Hour') {
            $('#rideHourText').text('Select Hour');
            rideHour = false;
            offerValidCheck();
        } else {
            $('#rideHourText').text('');
            rideHour = true;
            offerValidCheck();
        }
        if ($('#rideMinute').val() == 'Minute') {
            $('#rideMinuteText').text('Select Minute');
            rideMinute = false;
            offerValidCheck();
        } else {
            $('#rideMinuteText').text('');
            rideMinute = true;
            offerValidCheck();
        }
    });

    $('#number_people').click(() => {
        if ($('#rideMinute').val() == 'Minute') {
            $('#rideMinuteText').text('Select Minute');
            rideMinute = false;
            offerValidCheck();
        } else {
            $('#rideMinuteText').text('');
            rideMinute = true;
            offerValidCheck();
        }
    });
    $('#number_people').focusout(() => {
        if ($('#rideMinute').val() == 'Minute') {
            $('#rideMinuteText').text('Select Minute');
            rideMinute = false;
            offerValidCheck();
        } else {
            $('#rideMinuteText').text('');
            rideMinute = true;
            offerValidCheck();
        }
    });

    $('#price').focusin(() => {
        if ($('#rideMinute').val() == 'Minute') {
            $('#rideMinuteText').text('Select Minute');
            rideMinute = false;
            offerValidCheck();
        } else {
            $('#rideMinuteText').text('');
            rideMinute = true;
            offerValidCheck();
        }
    });
    $('#price').focusout(() => {
        if ($('#price').val() == '') {
            price = false;
            $('#priceText').text('Enter Fair');
            offerValidCheck();
        } else {
            price = true;
            $('#priceText').text('');
            if ($('#rideMinute').val() == 'Minute') {
                $('#rideMinuteText').text('Select Minute');
                rideMinute = false;
                offerValidCheck();
            } else {
                $('#rideMinuteText').text('');
                rideMinute = true;
                offerValidCheck();
            }
        }
    });

    $('#carRegis').focusin(() => {
        if ($('#rideMinute').val() == 'Minute') {
            $('#rideMinuteText').text('Select Minute');
            rideMinute = false;
            offerValidCheck();
        } else {
            $('#rideMinuteText').text('');
            rideMinute = true;
            offerValidCheck();
        }
    })
    $('#carRegis').keyup(() => {
        let str = $('#carRegis').val();
        console.log('Run...');
        if (carRegisCheck(str)) {
            $('#regisText').text('');
            carRegis = true;
            offerValidCheck();
        } else {
            $('#regisText').text('Length 7 and Format AB-0000');
            carRegis = false;
            offerValidCheck();
        }

    })

    function carRegisCheck(str) {
        if (str.length != 7) return false;
        else {
            if ((str.charCodeAt(0) >= 65 && str.charCodeAt(0) <= 90) || (str.charCodeAt(0) >= 97 && str.charCodeAt(0) <= 122)) {
                if ((str.charCodeAt(1) >= 65 && str.charCodeAt(1) <= 90) || (str.charCodeAt(1) >= 97 && str.charCodeAt(1) <= 122)) {
                    if (str[2] == '-') {
                        for (let i = 3; i < 7; i++) {
                            if (str.charCodeAt(i) < 48 || str.charCodeAt(i) > 57)
                                return false;
                        }
                        return true;
                    }
                }
            }
            return false;
        }
    }
    $('#carRegis').focusout(() => {
        if ($('#carRegis').val() == '') {
            $('#regisText').text('Enter Vecheicle Registration Number');
            carRegis = false;
            offerValidCheck();
        } else {
            if (carRegisCheck($('#carRegis').val())) {
                $('#regisText').text('');
                carRegis = true;
                offerValidCheck();
            } else {
                $('#regisText').text('Length 7 and Format AB-0000');
                carRegis = false;
                offerValidCheck();
            }
        }
    });

    $('#offercar').click(() => {
        vechType = 'CAR';
        $('#typeText').text('');
        offerValidCheck();
    });
    $('#offerbike').click(() => {
        vechType = 'BIKE';
        $('#typeText').text('');
        offerValidCheck();
    });

    $('#vecheicleImageUpload').click(() => {
        filepicker.pick({
                mimetype: 'image/*',
                /* Images only */
                maxSize: 1024 * 1024 * 5,
                /* 5mb */
                imageMax: [1500, 1500],
                /* 1500x1500px */
                cropRatio: 1 / 1,
                /* Perfect squares */
                container: 'window',
                services: ['*'] /* All available third-parties */
            },
            function(blob) {
                $('#vechicleImageText').text('');
                $('#vechicleImage').attr('src', blob.url);
                vechImage = blob.url;
                console.log('vechImage');
                offerValidCheck();
            },
            function(FPError) {
                $('#vechicleImageText').text('Max Size: 5MB, Only Images eithe Connection Error');
                $('#vechicleImage').attr('src', './images/carimg.jpg');
                vechImage = '';
                offerValidCheck();
            })
    });

    $('#drivingLienceUpload').click(() => {
        filepicker.pick({
                mimetype: 'image/*',
                /* Images only */
                maxSize: 1024 * 1024 * 5,
                /* 5mb */
                imageMax: [1500, 1500],
                /* 1500x1500px */
                cropRatio: 1 / 1,
                /* Perfect squares */
                container: 'window',
                services: ['*'] /* All available third-parties */
            },
            function(blob) {
                $('#drivingLienceText').text('');
                $('#drivingLienceImage').attr('src', blob.url);
                drivingLience = blob.url;
                offerValidCheck();
            },
            function(FPError) {
                $('#drivingLienceText').text('Max Size: 5MB, Only Images eithe Connection Error');
                $('#vechicleImage').attr('src', './images/driving.jpg');
                drivingLience = '';
                offerValidCheck();
            })
    })

    $('#offerSubmit').click(() => {
        let dd = $('#offerDate').val();
        console.log('Date:111', dd);
        let date = new Date(dd.toString());
        console.log('Date: ', date, '////', date.getDate());
        let hour = parseInt($('#rideHour').val());
        let min = parseInt($('#rideMinute').val());
        date.setHours(hour);
        date.setMinutes(min);
        let dayList = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        day = dayList[date.getDay()];
        let dateString = date.getDate().toString() + '-' + ((date.getMonth()) + 1).toString() + '-' + date.getFullYear();

        let offerDetails = {
            'name': userDetails.name,
            'email': userDetails.email,
            'phone_number': userDetails.phoneNumber,
            'user_pic': userDetails.profilrPic,
            'source': $('#offerSource').val().trim().toUpperCase(),
            'destination': $('#offerDest').val().trim().toUpperCase(),
            'dateString': dateString,
            'date': date.getTime(),
            'day': day,
            'hour': parseInt($('#rideHour').val()),
            'minute': parseInt($('#rideMinute').val()),
            'car_registration': $('#carRegis').val().trim().toUpperCase(),
            'vechicle_type': vechType,
            'driving_lience': drivingLience,
            'image': vechImage,
            'allow': parseInt($('#number_people').val()),
            'price': parseInt($('#price').val())
        };
        console.log('Send Data: ', offerDetails);
        $('#vechicle_details_model_wait').show();
        $.post('http://localhost:3000/ridesave', offerDetails, (response) => {
                $('#vechicle_details_model_wait').hide();
                $('#vechicle_details_model').show();
                $("#offerModal .close").click()
                swal({
                    title: "Done",
                    text: "Successfully Saved and Published",
                    imageUrl: '../images/successimage.png'
                });
                offerRideList('d', (err, data) => {
                    if (err) console.log('Error Due To Load Offer Data List')
                    else {
                        console.log('Offer Data List Load Successfully');
                        offerRideNotification('d', (err, data) => {
                            if (err) console.log('Error Due To Load Notification');
                            else console.log('Offer Notification Load');
                        })
                    }
                })
            })
            .fail(err => {
                $('#vechicle_details_model').show();
                $('#vechicle_details_model_wait').hide();
                $('#offerModal .close').click();
                if (err.responseJSON.status == 404) {
                    sweetAlert('Fail', err.responseJSON.err + '!Try To Login Again')
                } else if (err.responseJSON.status == 500) {
                    sweetAlert('Fail', err.responseJSON.err + '!Try Again ')
                } else {
                    sweetAlert('Connection Error.', 'Check Connection and Try Again');
                }
            })
    })

    $('#offerRideShowList').click(() => {
        lastRideIndex = 0;
        $('#findRideOptions').hide();
        $('#viewMyOfferRide').show();
        $('#viewMyOfferRide div').remove();
        $('#viewMoreOfferedRide').remove();
        if (JSON.parse(localStorage.getItem('offered_ride'))) {
            let len = JSON.parse(localStorage.getItem('offered_ride'));
            let btn1Text = '';
            let btn2Text = '';
            if (len.len == 1) {
                let cuDate = new Date().getTime();
                if ((len.data[0].date - cuDate) < 900000) {
                    btnText1 = '<button class="btn btn-primary offerListBtnClass disabled" type="button">View Details</button>';
                    btn2Text = '<button class="btn btn-primary offerListBtnClass disabled" type="button">Cancel Ride</button>';
                } else {
                    btn1Text = '<button class="btn btn-primary offerListBtnClass" type="button">View Details</button>';
                    btn2Text = '<button class="btn btn-primary offerListBtnClass" type="button">Cancel Ride</button>';
                }
                let str = '<div class="offerListDivClass">\
                    <div style="float: left; width: 80%; margin-left: 1%;">\
                        <h3>' + len.data[0].source + ' TO ' + len.data[0].destination + ' Date: ' + len.data[0].dateString + '</h3>\
                        <h3 style="margin-top: -1%;">Day: ' + len.data[0].day + ' Time: ' + len.data[0].hour + ':' + len.data[0].minute + ' </h3>\
                        <h4 style="margin-top: -1%;">Number Of People Booked: ' + len.data[0].booked + '</h4>\
                        <h5 style="margin-top: -1%;">Your Limit: ' + len.data[0].allow + '</h5>\
                        <h6>Ride Id: ' + len.data[0]._id + '</6>\
                    </div>\
                    <div style="margin-left: 2%;">\
                        ' + btn1Text + '\
                        <br>\
                        ' + btn2Text + '\
                    </div>\
                </div>'
                $('#viewMyOfferRide').append(str);
            } else listingOfferRideList();
        } else sweetAlert('Empty', "You Didn't Offered Any Ride")
    })

    function listingOfferRideList() {
        let btn1Text = '';
        let btn2Text = '';
        let str = '';
        let offeredData = JSON.parse(localStorage.getItem('offered_ride'));
        let offeredDataa = offeredData.data;
        j = 1;
        console.log('Length: ', offeredData.len);
        console.log('Last Index: ', lastRideIndex);
        while (j <= 3 && lastRideIndex < offeredData.len) {
            j++;
            if ((offeredDataa[lastRideIndex].date - (new Date().getTime())) < 900000) {
                btn1Text = '<button class="btn btn-primary offerListBtnClass disabled" type="button">View Details</button>';
                btn2Text = '<button class="btn btn-primary offerListBtnClass disabled" type="button">Cancel Ride</button>';
            } else {
                btn1Text = '<button class="btn btn-primary offerListBtnClass" type="button">View Details</button>';
                btn2Text = '<button class="btn btn-primary offerListBtnClass" type="button">Cancel Ride</button>';
            }
            str = '<div class="offerListDivClass">\
                    <div style="float: left; width: 80%; margin-left: 1%;">\
                        <h3>' + offeredDataa[lastRideIndex].source + ' TO ' + offeredDataa[lastRideIndex].destination + ' Date: ' + offeredDataa[lastRideIndex].dateString + '</h3>\
                        <h3 style="margin-top: -1%;">Day: ' + offeredDataa[lastRideIndex].day + ' Time: ' + offeredDataa[lastRideIndex].hour + ':' + offeredDataa[lastRideIndex].minute + ' </h3>\
                        <h4 style="margin-top: -1%;">Booked: ' + offeredDataa[lastRideIndex].booked + '</h4>\
                        <h5 style="margin-top: -1%;">Available: ' + offeredDataa[lastRideIndex].allow + '    Fair: ' + offeredDataa[lastRideIndex].price + '</h5>\
                        <h6>Ride Id: ' + offeredDataa[lastRideIndex]._id + '</6>\
                    </div>\
                    <div style="margin-left: 2%;">\
                        ' + btn1Text + '\
                        <br>\
                        ' + btn2Text + '\
                    </div>\
                </div>';
            $('#viewMyOfferRide').append(str);
            lastRideIndex++;
        }
        if (lastRideIndex < offeredData.len) {
            $('#viewMyOfferRide').append('<button id="viewMoreOfferedRide" class="btn btn-primary text-center" style="margin-top: 2%; width: 88%">View More Rides</button>');
        }
        console.log('Last Index Is: ', lastRideIndex);
    }

    $('#viewMyOfferRide').on('click', '#viewMoreOfferedRide', () => {
        $('#viewMoreOfferedRide').remove();
        listingOfferRideList();
    })

    $(document).on('click', '.offerListBtnClass', (e) => {
        if ($(e.target).text() == 'View Details') {
            let txt = ($($(e.target).parent().parent()).find('h6').text()).split(' ');
            let id = txt[2];
            $('#loadModel').modal('show');
            $.post('http://localhost:3000/passengerdetails', { email: userDetails.email, id: id }, (response) => {
                    $('#loadModel').modal('toggle');
                    if (response.len <= 0) {
                        sweetAlert('Empty', 'Nobody Booked Your Ride');
                    } else {
                        let str = '';
                        $('#passengerDetailsModal').modal('show');
                        $('#passengerDetailsModal .modal-body .table tbody tr').remove();
                        if (response.len == 1) {
                            str = '<tr>\
                                 <td class="text-center">1</td>\
                                 <td><img src=' + response.data[0].user_pic + ' alt="passenger Image" class="img-circle passengerDetailsImage img-responsive"/></td>\
                                 <td class="text-center">' + response.data[0].name + ' </td>\
                                 <td class="text-center">' + response.data[0].pnumber + '</td>\
                                </tr>';
                            $('#passengerDetailsModal .modal-body .table tbody').append(str);
                        } else {
                            let resData = response.data;
                            let i = 1;
                            resData.forEach(dir => {
                                str = '<tr>\
                                 <td class="text-center">' + i + '</td>\
                                 <td><img src=' + dir.user_pic + ' alt="passenger Image" class="img-circle passengerDetailsImage img-responsive"/></td>\
                                 <td class="text-center">' + dir.name + ' </td>\
                                 <td class="text-center">' + dir.pnumber + '</td>\
                                </tr>';
                                $('#passengerDetailsModal .modal-body .table tbody').append(str);
                                i++;
                            })
                        }
                    }

                })
                .fail((err) => {
                    $('#loadModel').modal('toggle');
                    if (err.responseJSON.status == 404) {
                        sweetAlert('Failed', 'Your Account Not Found! Login Again');
                        window.location.href = "http://localhost:3000/login";
                    } else if (err.responseJSON.status == 500)
                        sweetAlert('Failed', 'Internal Server Error! Try Again')
                    else if (err.responseJSON.status == 422)
                        sweetAlert('Failed', 'Some Information Mising! Please Reload The Page')
                    else
                        sweetAlert('Failed', 'Connection Problem! Try Again')
                })
        } else if ($(e.target).text() == "Cancel Ride") {
            swal({ title: 'Are you sure For Cancel?', type: 'info', showCancelButton: true })
                .then(function(accept) {
                        let txt = ($($(e.target).parent().parent()).find('h6').text()).split(' ');
                        let id = txt[2];
                        $('#loadModel').modal('show');
                        $.post('http://localhost:3000/cancelofferride', { id: id }, (response) => {
                                $('#loadModel').modal('toggle');
                                swal("Canceled!", "Successfully Canceled Ride!", "success")
                                $($(e.target).parent()).find('button').attr('disabled', true);
                                offerRideList('d', (err, data) => {
                                    if (err) console.log('List Load Error');
                                    else {
                                        offerRideNotification('d', (errr, datt) => {
                                            if (errr) console.log('Notification Load Error')
                                            else console.log('Notification Load Successfully')
                                        })
                                    }
                                })
                            })
                            .fail(err => {
                                if (err.responseJSON.status == 403) {
                                    $('#loadModel').modal('toggle');
                                    sweetAlert('Failed', 'Not Canceled! Because Not Able To Notify People Select You Ride, Try Again');
                                } else if (err.responseJSON.status == 500) {
                                    $('#loadModel').modal('toggle');
                                    sweetAlert('Failed', 'internal Server Error! Try Again');
                                } else {
                                    $('#loadModel').modal('toggle');
                                    sweetAlert('Failed', 'Connection Problem! Try Again');
                                }
                            })
                    },
                    function(dismiss) {
                        console.log('Dismiss Cancel Ride');
                    })
        }
    })

    $(document).on('click', '.passengerDetailsImage', (e) => {
        window.open($(e.target).attr('src'));
    })

    function sweetAlert(msg, msg2) {
        swal({
            title: msg,
            text: msg2,
            type: 'error'
        })
    }

    function offerRideList(d, cb) {
        $.post('http://localhost:3000/offerridelist', { email: userDetails.email }, (response) => {
                let res = response.data;
                let dat = {};
                $('#offerRideDateList ul li').remove();
                if (response.len > 0) {
                    if (response.len == 1) {
                        $('#offerRideDateList ul').append('<li>' + res[0].dateString + '</li>');
                        $('#noOfOfferRide').text('Number Of Ride Offered 1');
                        dat = {
                            len: response.len,
                            data: res
                        };
                        localStorage.setItem('offered_ride', JSON.stringify(dat));
                    } else {
                        res.sort((a, b) => { return a.date < b.date });
                        let offerDateArray = [];
                        res.forEach((itm) => {
                            if (offerDateArray.indexOf(itm.dateString) == -1) offerDateArray.push(itm.dateString)
                        })
                        $('#noOfOfferRide').text('Number Of Ride Offered ' + res.length);
                        offerDateArray.forEach(dir => {
                            $('#offerRideDateList ul').append('<li>' + dir + '</li>')
                        })
                        dat = {
                            len: response.len,
                            data: res
                        }
                        localStorage.setItem('offered_ride', JSON.stringify(dat));
                    }
                    cb(null, null);
                } else {
                    $('#noOfOfferRide').text('Number Of Ride Offered 0');
                    cb(null, null);
                }
            })
            .fail((err) => {
                $('#noOfOfferRide').text('Number Of Ride Offered 0');
                cb(err, null);
            })
    }

    function offerRideNotification(d, cb) {
        console.log('Data Ride:', JSON.parse(localStorage.getItem('offered_ride')));
        $('#offerRideNotify div').remove();
        if (localStorage.getItem('offered_ride')) {
            let offer_ride = JSON.parse(localStorage.getItem('offered_ride'));
            if (offer_ride.len > 0) {
                offer_ride_data = offer_ride.data;
                let today = new Date();
                let hou = today.getHours();
                let min = today.getMinutes();
                today = today.getTime();
                let upDate = new Date();
                upDate = new Date(upDate.setHours(23));
                upDate = new Date(upDate.setMinutes(59));
                upDate = upDate.getTime();
                let today_journey_array = [];
                offer_ride_data.forEach(dir => {
                    if (dir.date >= today && dir.date <= upDate) {
                        today_journey_array.push(dir); // today offered ride
                    }
                });
                if (today_journey_array.length == 0) {
                    let str = '<div class="emptyNotificationClass"\
                        <h1>Today You Dont Have Any Ride For Others </h1></div>';
                    $('#offerRideNotify').append(str);
                    cb(null, null);
                } else {
                    let str = '';
                    today_journey_array.forEach(dir => {
                        let diff = (((dir.date - today) / (1000 * 60 * 60)) % 24);
                        let hour = Math.floor(diff);
                        let minute = (diff - hour).toFixed(2).substring(2);
                        let leftTime = hour.toString() + ':' + minute.toString() + ' Hour Left';
                        str = '<div class="notificationDivClass">\
                                <P>' + dir.source + ' TO ' + dir.destination + '(TODAY) ' + dir.hour + ': ' + dir.minute + '</P>\
                                <p style="margin-top: -4%;">' + leftTime + '</p>\
                                <p style="margin-top: -4%;">Need To Receive: ' + dir.booked + ' Person</p>\
                           </div>';
                        $('#offerRideNotify').append(str);
                    });
                    cb(null, null);
                }
            } else {
                let str = '<div class="emptyNotificationClass"\
                        <h1>Today You Dont Have Any Ride For Others</h1></div>';
                $('#offerRideNotify').append(str);
                cb('error', null);
            }
        } else {
            let str = '<div class="emptyNotificationClass"\
                        <h1>Today You Dont Have Any Ride For Others</h1></div>';
            $('#offerRideNotify').append(str);
            cb('error', null);
        }
    }
})