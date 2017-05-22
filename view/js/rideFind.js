$(document).ready(() => {
    console.log('Find Ride Script');
    let findSource = false;
    let findDest = false;
    let findDate = false;
    let cardType = '';
    let cardNum = '';
    let palceRegx = new RegExp('^[a-zA-Z0-9 ]+$');
    let adharRegx = new RegExp('^[0-9]{12,12}');
    let panRegx = new RegExp('^[a-zA-Z0-9]{10,10}')
    let adhShw = false;
    let panShw = false;
    let voteShw = false;
    let lpuShw = false;
    let obj = {};
    let findRideData;
    let lstIndex = 0;

    if (!localStorage.getItem('car_pol_user_details')) {
        window.location.href = "http://localhost:3000/login";
    }
    let userDetails = JSON.parse(localStorage.getItem('car_pol_user_details'));
    rideList('d', (err, data) => {
        console.log('Function Listing Run');
        if (err) console.log('Fail To First Time Load RideList');
        else {
            console.log('RideList Loaded Successfully');
            rideNotification('d', (err, data) => {
                if (err) console.log('Error Load Taked Ride Notification')
                else console.log('Ride Notification Loaded')
            })
        }
    })
    $('#findSave').attr('disabled', true);
    $('#rieModalShow').click(() => {
        if (userDetails.profilrPic == 'no' || userDetails.profilrPic == '' || typeof userDetails.profilrPic == undefined) {
            $('#rieModalShow').ready(() => {
                $("#rieModalShow .close").click();
                sweetAlert('Warning', 'Upload Profile Piture Before Offer A Ride');
            })
        } else {
            $('#riderDate').attr('min', new Date().toISOString().substring(0, 10));
            cardShow(false, false, false, false);
            $('#riderName').text(userDetails.name);
            $('#riderNumber').text(userDetails.phoneNumber);
            $('#rideremail').text(userDetails.email);
            setRideAlert('');
        }
    });

    function setOtherCardText() {
        $('#adharText').text('');
        $('panText').text('');
        $('#lpuText').text('');
    }

    function setRideAlert(msg) {
        if (msg == '') $('#rideAlert').hide();
        else {
            $('#rideAlert').text(msg);
            $('#rideAlert').show();
        }
    }

    function cardShow(adhar, pan, voter, lpu) {
        if (adhar) {
            $('#adharNumber').show();
            $('#adharNumber').val('');
            $('#adharText').text('');
            $('#lpuText').text('');
            adhShw = true;
        } else {
            $('#adharNumber').hide();
            $('#adharNumber').val('');
            $('#adharText').text('');
            adhShw = false;
        }
        if (pan) {
            $('#panNumber').show();
            $('#panNumber').val('');
            $('panText').text('');
            panShw = true;
        } else {
            $('#panNumber').hide();
            $('#panNumber').val('');
            $('panText').text('');
            panShw = false;
        }
        if (voter) {
            $('#voterNumber').show();
            $('#voterNumber').val('');
            $('voterText').text('');
            voteShw = true;
        } else {
            $('#voterNumber').hide();
            $('#voterNumber').val('');
            $('voterText').text('');
            voteShw = false;
        }
        if (lpu) {
            $('#lpuNumber').show();
            $('#lpuNumber').val('');
            $('#lpuText').text('');
            lpuShw = true;
        } else {
            $('#lpuNumber').hide();
            $('#lpuNumber').val('');
            $('#lpuText').text('');
            lpuShw = false;
        }
    }

    function checkFindValidation() {
        console.log('Card Number: ', cardNum);
        if (findSource == true && findDest == true && findDate == true) {
            if (cardType != '') {
                console.log('Card Type: ', cardType);
                if (cardNum != '') {
                    console.log('Inside..');
                    $('#findSave').attr('disabled', false);
                } else {
                    if (adhShw) $('#adharText').text('Enter Adharcard Number');
                    if (panShw) $('panText').text('Enter PAN Card Number');
                    if (voteShw) $('voterText').text('Enter VoterId Card Number');
                    if (lpuShw) $('#lpuText').text('Enter LPU Card Number');
                    $('#findSave').attr('disabled', true);
                }
            } else {
                $('#cardTypeText').text('Please Select Card Type');
                $('#findSave').attr('disabled', true);
            }
        }
    }

    $('#riderSource').keyup(() => {
        if (palceRegx.test($('#riderSource').val())) {
            findSource = true;
            $('#riderSourceText').text('');
            checkFindValidation();
        } else {
            findSource = false;
            $('#riderSourceText').text('Enter Valid Source');
            checkFindValidation();
        }
    })
    $('#riderSource').focusout(() => {
        if ($('#riderSource').val() == '') {
            findSource = false;
            $('#riderSourceText').text('Source Required');
            checkFindValidation();
        } else {
            if (palceRegx.test($('#riderSource').val())) {
                findSource = true;
                $('#riderSourceText').text('');
                checkFindValidation();
            } else {
                findSource = false;
                $('#riderSourceText').text('Enter Valid Source');
                checkFindValidation();
            }
        }
    })

    $('#riderDestination').keyup(() => {
        if (palceRegx.test($('#riderDestination').val())) {
            findDest = true;
            $('#riderDestText').text('');
            checkFindValidation();
        } else {
            findDest = false;
            $('#riderDestText').text('Enter Valid Destination');
            checkFindValidation();
        }
    })
    $('#riderDestination').focusout(() => {
        if ($('#riderDestination').val() == '') {
            findDest = false;
            $('#riderDestText').text('Destination Required');
            checkFindValidation();
        } else {
            if (palceRegx.test($('#riderDestination').val())) {
                findDest = true;
                $('#riderDestText').text('');
                checkFindValidation();
            } else {
                findDest = false;
                $('#riderDestText').text('Enter Valid Destination');
                checkFindValidation();
            }
        }
    })

    $('#riderDate').focusout(() => {
        if ($('#riderDate').val() == '') {
            $('#riderDateText').text('Select Journey Date');
            findDate = false;
            checkFindValidation();
        } else {
            $('#riderDateText').text('');
            findDate = true;
            checkFindValidation();
        }
    })

    $('#hour').focusout(() => {
        if ($('#riderDate').val() == '') {
            $('#riderDateText').text('Select Journey Date');
            findDate = false;
            checkFindValidation();
        } else {
            $('#riderDateText').text('');
            findDate = true;
            checkFindValidation();
        }
    })

    $('#minute').focusout(() => {
        if ($('#riderDate').val() == '') {
            $('#riderDateText').text('Select Journey Date');
            findDate = false;
            checkFindValidation();
        } else {
            $('#riderDateText').text('');
            findDate = true;
            checkFindValidation();
        }
    })

    $('#adhar').click(() => {
        cardType = 'ADHAR';
        cardNum = '';
        $('#cardTypeText').text('');
        cardShow(true, false, false, false);
        setOtherCardText();
        checkFindValidation();
    });
    $('#pan').click(() => {
        cardType = 'PAN';
        cardNum = '';
        $('#cardTypeText').text('');
        cardShow(false, true, false, false);
        setOtherCardText();
        checkFindValidation();
    });
    $('#voter').click(() => {
        cardType = 'VOTER';
        cardNum = '';
        $('#cardTypeText').text('');
        cardShow(false, false, true, false);
        setOtherCardText();
        checkFindValidation();
    });
    $('#lpu').click(() => {
        cardType = 'LPU';
        cardNum = '';
        $('#cardTypeText').text('');
        cardShow(false, false, false, true);
        setOtherCardText();
        checkFindValidation();
    });

    $('#adharNumber').keyup(() => {
        if ($('#adharNumber').val().length != 12) {
            $('#adharText').text('Enter Valid Number "xxxxxxxxxxxx"');
            cardNum = '';
            checkFindValidation();
        } else if (adharRegx.test($('#adharNumber').val())) {
            $('#adharText').text('');
            cardNum = $('#adharNumber').val();
            checkFindValidation();
        } else {
            $('#adharText').text('Enter Valid Number "xxxxxxxxxxxx"');
            cardNum = '';
            checkFindValidation();
        }
    })

    $('#adharNumber').focusout(() => {
        if ($('#adharNumber').val() == '') {
            $('#adharText').text('Card Number Required');
            checkFindValidation();
        } else if ($('#adharNumber').val().length != 12) {
            $('#adharText').text('Enter Valid Number "xxxxxxxxxxxx"');
            cardNum = '';
            checkFindValidation();
        } else {
            if (adharRegx.test($('#adharNumber').val())) {
                $('#adharText').text('');
                cardNum = $('#adharNumber').val();
                checkFindValidation();
            } else {
                $('#adharText').text('Enter Valid Number "xxxxxxxxxxxx"');
                cardNum = '';
                checkFindValidation();
            }
        }
    })

    $('#panNumber').keyup(() => {
        if ($('#panNumber').val().length != 10) {
            $('#panText').text('Enter Valid Number "xxxxxxxxxxxx"');
            cardNum = '';
            checkFindValidation();
        } else {
            if (panRegx.test($('#panNumber').val())) {
                $('#panText').text('');
                cardNum = $('#panNumber').val();
                checkFindValidation();
            } else {
                $('#panText').text('Enter Valid Number "xxxxxxxxxxxx"');
                cardNum = '';
                checkFindValidation();
            }
        }
    })

    $('#panNumber').focusout(() => {
        if ($('#panNumber').val() == '') {
            $('#panText').text('Card Number Required');
            cardNum = '';
            checkFindValidation();
        } else if ($('#panNumber').val().length != 10) {
            $('#panText').text('Enter Valid Number "xxxxxxxxxxxx"');
            cardNum = '';
            checkFindValidation();
        } else {
            if (panRegx.test($('#panNumber').val())) {
                $('#panText').text('');
                cardNum = $('#panNumber').val();
                checkFindValidation();
            } else {
                $('#panText').text('Enter Valid Number "xxxxxxxxxxxx"');
                cardNum = '';
                checkFindValidation();
            }
        }
    })

    function voterCardCheck(str) {
        console.log('Str: ', str);
        if (str.length != 10) return false;
        else {
            if ((str.charCodeAt(0) >= 65 && str.charCodeAt(0) <= 90) || (str.charCodeAt(0) >= 97 && str.charCodeAt(0) <= 122)) {
                if ((str.charCodeAt(1) >= 65 && str.charCodeAt(1) <= 90) || (str.charCodeAt(1) >= 97 && str.charCodeAt(1) <= 122)) {
                    if ((str.charCodeAt(2) >= 65 && str.charCodeAt(2) <= 90) || (str.charCodeAt(2) >= 97 && str.charCodeAt(2) <= 122)) {
                        for (let i = 3; i < 10; i++) {
                            if (str.charCodeAt(i) < 48 || str.charCodeAt(i) > 57)
                                return false;
                        }
                        return true;
                    } else return false;
                } else return false;
            } else return false
        }
    }
    $('#voterNumber').keyup(() => {
        let val = $('#voterNumber').val();
        console.log('Voter: ', val);
        if (voterCardCheck(val)) {
            console.log('Valid Voter');
            $('#voterText').text('');
            cardNum = $('#voterNumber').val();
            checkFindValidation();
        } else {
            $('#voterText').text('Length 10 and Format "ABC1234567"');
            cardNum = '';
            checkFindValidation();
        }
    })

    $('#voterNumber').focusout(() => {
        if ($('#voterNumber').val() == '') {
            $('#voterText').text('Enter Voter Card Number');
            cardNum = '';
            checkFindValidation();
        } else {
            let val = $('#voterNumber').val();
            console.log('Voter: ', val);
            if (voterCardCheck($('#voterNumber').val())) {
                console.log('Valid Voter');
                $('#voterText').text('');
                cardNum = $('#voterNumber').val();
                checkFindValidation();
            } else {
                $('#voterText').text('Length 10 and Format "ABC1234567"');
                cardNum = '';
                checkFindValidation();
            }
        }
    })

    function lpuCardCheck(str) {
        if (str.length != 8) return false;
        else if (str[0] == '0') return false;
        else {
            for (let i = 1; i < 8; i++) {
                if (str[i] < 48 && str[i] > 57)
                    return false;
            }
            return true;
        }
    }
    $('#lpuNumber').keyup(() => {
        if (lpuCardCheck($('#lpuNumber').val())) {
            $('#lpuText').text('');
            cardNum = $('#lpuNumber').val();
            checkFindValidation();
        } else {
            $('#lpuText').text('Enter Valid Number, Format: "11301245"');
            cardNum = '';
            checkFindValidation();
        }
    })
    $('#lpuNumber').focusout(() => {
        if ($('#lpuNumber').val() == '') {
            $('#lpuText').text('Card Number Required');
            cardNum = '';
            checkFindValidation();
        } else {
            if (lpuCardCheck($('#lpuNumber').val())) {
                $('#lpuText').text('');
                cardNum = $('#lpuNumber').val();
                checkFindValidation();
            } else {
                $('#lpuText').text('Enter Valid Number, Format: "11301245"');
                cardNum = '';
                checkFindValidation();
            }
        }
    })

    $('#findSave').click(() => {
        let dayList = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        console.log('Date String', $('#riderDate').val(), ' Type is: ', typeof $('#riderDate').val())
        let date = new Date($('#riderDate').val());
        console.log('Date is: ', date);
        console.log('Hour: ', $('#hour').val());
        date.setHours(parseInt($('#hour').val()));
        console.log('Date is: ', date);
        date.setMinutes(parseInt($('#minute').val()));
        console.log('Date: ', date);
        let dateString = date.getDate().toString() + '-' + ((date.getMonth()) + 1).toString() + '-' + date.getFullYear();
        obj = {
            'email': userDetails.email,
            'source': $('#riderSource').val().toUpperCase(),
            'dest': $('#riderDestination').val().toUpperCase(),
            'dateString': dateString,
            'date': date.getTime(),
            'day': dayList[date.getDay()],
            'cardType': cardType,
            'cardNum': cardNum
        };
        console.log('Send Data: ', obj);
        $.post('http://localhost:3000/findmyride', obj, (res) => {
                $('#findRide .close').click();
                console.log('response Is: ', res);
                if (res.data.length <= 0) {
                    sweetAlert('Sorry!', 'Not Found Any Options For You');
                    setContetDivFind();
                    findRideData = [];
                } else {
                    findRideData = res.data;
                    console.log('Find Data: ', findRideData);
                    swal({
                        title: "Done",
                        text: "We Found " + res.data.length + ' Options For You',
                        imageUrl: '../images/successimage.png'
                    });
                    setContetDivFind();
                    insertFindRideOptionDiv(findRideData);
                }

            })
            .fail((err) => {
                console.log("Error: ", err);
                setContetDivFind();
                findRideData = [];
                if (err.responseJSON.status == 422) setRideAlert('Provide Data Please')
                else if (err.responseJSON.status == 404) {
                    sweetAlert('Fail', 'Try To Login Again');
                } else if (err.responseJSON.status == 500) setRideAlert('Internal Server Error!Please Try Again')
                else setRideAlert('Connection Error! Try Again');
            })
    })

    function sweetAlert(msg, msg2) {
        swal({
            title: msg,
            text: msg2,
            type: 'error'
        })
    }

    $('#rideModelClose').click(() => $('#findRide .close').click())

    $(document).on('click', '.userPicStyle', (e) => {
        console.log('Run Script: ');
        $('#imgShowDiv').modal('toggle');
        $('#imgShowTitle').text('User Profile Picture');
        $('#imgModalImgSrc').attr('src', $(e.target).attr('src'));
    })

    $(document).on('click', '.drivingLiencePicStyle', (e) => {
        console.log('Run Script: ');
        $('#imgShowDiv').modal('toggle');
        $('#imgShowTitle').text('Driving Lience Image');
        $('#imgModalImgSrc').attr('src', $(e.target).attr('src'));
    })

    $(document).on('click', '.carPicStyle', (e) => {
        console.log('Run Script: ');
        $('#imgShowDiv').modal('toggle');
        $('#imgShowTitle').text('Vechicle Image');
        $('#imgModalImgSrc').attr('src', $(e.target).attr('src'));
    })

    $(document).on('click', '.btnnClass', (e) => {
        if ($(e.target).text() == 'Remove') {
            findRideData.splice($(e.target).parent().parent().parent().index(), 1)
            console.log('After Delete Data is: ', findRideData);
            $(e.target).parent().parent().parent().remove();

        } else if ($(e.target).text() == 'Apply') {
            let ind = $(e.target).parent().parent().parent().index();
            swal({ title: 'Are you sure?', type: 'info', showCancelButton: true }).then(
                function(result) {
                    let bookData = {
                        'name': userDetails.name,
                        'ownername': findRideData[ind].name,
                        'email': userDetails.email,
                        'pnumber': userDetails.phoneNumber,
                        'user_pic': userDetails.profilrPic,
                        'owner_pic': findRideData[ind].user_pic,
                        'source': obj.source,
                        'destination': obj.dest,
                        'date': findRideData[ind].date,
                        'dateString': findRideData[ind].dateString,
                        'day': findRideData[ind].day,
                        'cardType': obj.cardType,
                        'cardNum': obj.cardNum,
                        'car_number': findRideData[ind].car_registration,
                        'ride_id': findRideData[ind]._id,
                        'price': findRideData[ind].price
                    }
                    console.log('Booked Data: ', bookData);
                    $.post('http://localhost:3000/ridebook', bookData, (response) => {
                            swal({
                                title: 'Success',
                                text: 'Your Ride Successfully Booked',
                                imageUrl: '../images/congrts.gif'
                            });
                            $(e.target).attr('disabled', true);
                            rideList('d', (err, data) => {
                                if (err) console.log('Not Able To Load Ride List');
                                else {
                                    console.log('Ride List Added To You Content');
                                    rideNotification('d', (err, data) => {
                                        if (err) console.log('Error Loading Ride Taked List')
                                        else console.log('Ride Taked List Successfully Loaded')
                                    })
                                }
                            })
                        })
                        .fail(err => {
                            if (err.responseJSON.status == 404 && err.responseJSON.type == 2) {
                                sweetAlert('Fail', 'This Ride Not Found');
                            } else if (err.responseJSON.status == 422)
                                sweetAlert('Fail', 'Enter Correct Data');
                            else if (err.responseJSON.status == 404) {
                                sweetAlert('Fail', 'You Not Found! Try Login Again');
                                window.location.href = "http://localhost:3000/login";
                            } else if (err.responseJSON.status == 500)
                                sweetAlert('Fail', 'Internal Server Error! Try Again');
                            else sweetAlert('Fail', 'Connection Error! Try Again');
                        })
                },
                function(dismiss) {
                    console.log('No');
                }
            );
        } else { /* Nothing To Do*/ }
    })

    function insertFindRideOptionDiv(data) {
        console.log('Div Insert');
        findRideOptionsDiv = '';
        data.forEach(dir => {
            let user_pic = '';
            let drive_lin = '';
            let car_pic = '';
            if (dir.user_pic == '' || dir.user_pic == 'no' || dir.user_pic == 'No') {
                user_pic = './images/lpu.jpg';
            } else {
                user_pic = dir.user_pic;
            }
            console.log('User Pic: ', user_pic);

            if (dir.driving_lience == '' || dir.driving_lience == 'no' || dir.driving_lience == 'No') {
                drive_lin = './images/driving.jpg';
            } else {
                drive_lin = dir.driving_lience;
            }

            console.log('Drive Pic: ', drive_lin);

            if (dir.vechicle_image == '' || dir.vechicle_image == 'no' || dir.vechicle_image == 'No') {
                car_pic = './images/carpool.png';
            } else {
                car_pic = dir.vechicle_image;
            }

            console.log('Vechicle Pic: ', car_pic);
            let findRideOptionsDiv = '<div class="row findRideOtionStyle">\
                    <img class="userPicStyle img-circle img-responsive" src="' + user_pic + '" alt="user pic" />\
                    <img class="drivingLiencePicStyle img-rounded img-responsive" src="' + drive_lin + '" alt="driving lience" />\
                    <img class="carPicStyle img-rounded img-responsive" src="' + car_pic + '" alt="vechicle pic" />\
                <div style="float: left; width: 60%"><div class="row text-center">\
                    <label style="margin-left: 0.5%;">' + dir.name + '</label>\
                    <label style="margin-left: 0.5%;">Ph: ' + dir.phone_number + '</label>\
                    <label style="margin-left: 0.5%;">Date: ' + dir.dateString + '</label>\
                    <label style="margin-left: 0.5%;">Day: ' + dir.day + '</label>\
                    <label style="margin-left: 0.5%;">Time: ' + dir.hour + ':' + dir.minute + '</label>\
                </div>\
                <div class="row text-center">\
                    <label style="margin-left: 0.5%;">' + dir.source + ' To ' + dir.destination + '</label>\
                    <label style="margin-left: 0.5%;">Total Sheet: ' + dir.allow + '</label>\
                    <label style="margin-left: 0.5%">Booked Seat' + dir.booked + '</label>\
                    <label style="margin-left: 0.5%;">Vechicle Type: ' + dir.vechicle_type + '</label>\
                </div>\
                <div class="row text-center">\
                <label style="margin-left: 0.5%;">Vechicle Number: ' + dir.car_registration + '    Fair: ' + dir.price + '</label>\
                </div>\
                <div class="row text-center">\
                <button type="button" class="btn btn-primary btnnClass">Apply</button>\
                <button type="button" class="btn btn-primary btnnClass">Remove</button>\
                </div></div></div>';
            $('#findRideOptions').append(findRideOptionsDiv);
        })
    }

    function setContetDivFind() {
        console.log('Set Content');
        $('#findRideOptions').empty();
        $('#findRideOptions').show();
        $('#viewMyOfferRide').hide();
    }

    $('#logoutbtn').click(() => {
        swal({ title: 'Are you sure To Logout?', type: 'info', showCancelButton: true }).then(
            function(result) {
                localStorage.clear('car_pol_user_details');
                localStorage.clear('booked_ride');
                localStorage.clear('offered_ride');
                window.location.href = "http://localhost:3000/login";
            },
            function(dismiss) {
                //Nothing To Do
            })
    })

    function rideList(d, cb) {
        console.log('Function Called');
        $.post('http://localhost:3000/showride', { email: userDetails.email }, (response) => {
            let dat = {};
            if (response.len > 0) {
                if (response.len == 1) {
                    dat = {
                        len: response.len,
                        data: response.data
                    };
                    $('#rideTakedDateList ul li').remove();
                    $('#rideTakedDateList ul').append('<li>' + response.data[0].dateString + '</li>');
                    $('#noOfTakedRide').text('Number Ride Taked: 1');
                } else {
                    let sortData = response.data;
                    sortData.sort((a, b) => { return a.date < b.date });
                    let rideDateArray = [];
                    sortData.forEach((itm) => {
                        if (rideDateArray.indexOf(itm.dateString) == -1) rideDateArray.push(itm.dateString)
                    })
                    dat = {
                        len: response.len,
                        data: sortData
                    }
                    $('#rideTakedDateList ul li').remove();
                    rideDateArray.forEach(itm => $('#rideTakedDateList ul').append('<li>' + itm + '</li>'))
                    $('#noOfTakedRide').text('Number Of Ride Taked: ' + (sortData.length).toString());
                }
                localStorage.setItem('booked_ride', JSON.stringify(dat));
            } else {
                $('#noOfTakedRide').text('Number Of Ride You Taked: 0');
                $('#rideTakedDateList ul li').remove();
            }
            cb(null, null);
        }).
        fail((err) => {
            cb(err, null);
        })
    }

    function rideNotification(s, cb) {
        $('#rideTakeNotify div').remove();
        let str;
        if (JSON.parse(localStorage.getItem('booked_ride'))) {
            let book_ride = JSON.parse(localStorage.getItem('booked_ride'));
            if (book_ride.len > 0) {
                book_ride_data = book_ride.data;
                let today = new Date();
                let hou = today.getHours();
                let min = today.getMinutes();
                today = today.getTime();
                let upDate = new Date();
                upDate = new Date(upDate.setHours(23));
                upDate = new Date(upDate.setMinutes(59));
                upDate = upDate.getTime();
                let today_ride_array = [];
                book_ride_data.forEach(dir => {
                    if (dir.date >= today && dir.date <= upDate) {
                        today_ride_array.push(dir);
                    }
                });
                if (today_ride_array == 0) {
                    let str = '<div class="emptyNotificationClass"\
                        <h1>Today No Rides</h1></div>';
                    $('#rideTakeNotify').append(str);
                    cb(null, null);
                } else {
                    let str = '';
                    today_ride_array.forEach(dir => {
                        let dtt = dir.date;
                        let diff = (((dir.date - today) / (1000 * 60 * 60)) % 24);
                        let datt = new Date(parseInt(dtt));
                        let jHour = datt.getHours();
                        let jMinute = datt.getMinutes();
                        let hour = Math.floor(diff);
                        let minute = (diff - hour).toFixed(2).substring(2);
                        let leftTime = hour.toString() + ':' + minute.toString() + ' Hour Left';
                        str = '<div class="notificationDivClass">\
                                <P>' + dir.source + ' TO ' + dir.destination + '(TODAY) ' + jHour + ':' + jMinute + ' </P>\
                                <p style = "margin-top: -4%;" > ' + leftTime + ' </p>\
                                <p style = "margin-top: -4%;">' + dir.car_number + '  ' + dir.ownername + '</p>\
                            </div>';
                        $('#rideTakeNotify').append(str);
                    });
                    cb(null, null);
                }
            } else {
                console.log('Ride Error Run');
                str = '<div class="emptyNotificationClass"\
                        <h1>Today No Rides</h1></div>';
                $('#rideTakeNotify').append(str);
                cb('error', null);
            }
        } else {
            str = '<div class="emptyNotificationClass"\
                        <h1>Today No Rides</h1></div>';
            $('#rideTakeNotify').append(str);
            cb('error', null);
        }
    }

    $('#bookedRideShowList').click(() => {
        $('#findRideOptions').empty();
        $('#findRideOptions').show();
        $('#viewMyOfferRide').empty();
        $('#viewMyOfferRide').hide();
        lstIndex = 0;
        rideListShowFun();
    })

    function rideListShowFun() {
        if (!localStorage.getItem('booked_ride') || (JSON.parse(localStorage.getItem('booked_ride'))).len <= 0)
            sweetAlert('Empty', 'You Never Booked Any Ride');
        else {
            let dat = JSON.parse(localStorage.getItem('booked_ride'));
            let str = '',
                btnText = '';
            let hou, min, tday, ddate;
            if (dat.len == 1) {
                tday = (new Date()).getTime();
                ddate = new Date(parseInt(dat.data[0].date));
                hou = ddate.getHours();
                min = ddate.getMinutes();
                if (dat.data[0].date - tday < 900000)
                    btnText = '<button class="btn btn-primary rideListCancelBtn disabled">Cancel</button>';
                else {
                    btnText = '<button class="btn btn-primary rideListCancelBtn">Cancel</button>';
                }
                str = '\
                <div class="rideListDivClass">\
                    <div style="float:left; width: 10%;margin-top:8%;">\
                        <img class="rideListOwnerPicClass img-circle img-responsive" src=' + dat.data[0].owner_pic + ' alt="owner iamge"/>\
                    </div>\
                    <div class="rideListDetailClass text-center">\
                            <h4>' + dat.data[0].source + ' To ' + dat.data[0].destination + '  Date: ' + dat.data[0].dateString + '</h4>\
                            <h4>Day: ' + dat.data[0].day + 'Time: ' + hou + ':' + min + ' Hours</h4>\
                            <h4>Owner Name: ' + dat.data[0].ownername + ' Car Number: ' + dat.data[0].car_number + '</h4>\
                            <h5>Fair: ' + dat.data[0].price + '</h5>\
                            <h6>Ride Id: ' + dat.data[0].ride_id + '</h6>\
                    </div>\
                    ' + btnText + '\
                </div>';
                $('#findRideOptions').append(str);
            } else {
                ride_data = dat.data;
                let j = 1;
                while (j <= 3 && lstIndex < dat.len) {
                    tday = (new Date()).getTime();
                    ddate = ride_data[lstIndex].date;
                    ddate = new Date(parseInt(ddate));
                    hou = ddate.getHours();
                    min = ddate.getMinutes();
                    if (ride_data[lstIndex].date - tday < 900000)
                        btnText = '<button class="btn btn-primary rideListCancelBtn disabled">Cancel</button>';
                    else {
                        btnText = '<button class="btn btn-primary rideListCancelBtn">Cancel</button>';
                    }
                    str = '\
                        <div class="rideListDivClass">\
                            <div style="float:left; width: 10%;margin-top:8%;">\
                                <img class="rideListOwnerPicClass img-circle img-responsive" src=' + ride_data[lstIndex].owner_pic + ' alt="owner iamge"/>\
                            </div>\
                            <div class="rideListDetailClass text-center">\
                                    <h4>' + dat.data[0].source + ' To ' + ride_data[lstIndex].destination + '  Date: ' + ride_data[lstIndex].dateString + '</h4>\
                                    <h4>Day: ' + ride_data[lstIndex].day + 'Time: ' + hou + ':' + min + ' Hours</h4>\
                                    <h4>Owner Name: ' + ride_data[lstIndex].ownername + ' Car Number: ' + ride_data[lstIndex].car_number + '</h4>\
                                    <h5>Fair: ' + ride_data[lstIndex].price + '</h5>\
                                    <h6>Ride Id: ' + ride_data[lstIndex].ride_id + '</h6>\
                            </div>\
                            ' + btnText + '\
                        </div>';
                    $('#findRideOptions').append(str);
                    lstIndex++;
                    j++;
                }
                if (lstIndex < dat.len) {
                    $('#findRideOptions').append('<button id="rideListMore" class="btn btn-default rideListMoreBtn">More Rides</button>');
                }
            }
        }
    }

    $(document).on('click', '.rideListMoreBtn', () => {
        $('#findRideOptions .rideListMoreBtn').remove();
        rideListShowFun();
    })

    $(document).on('click', '.rideListOwnerPicClass', (e) => {
        $('#imgShowDiv').modal('show');
        $('#imgModalImgSrc').attr('src', $(e.target).attr('src'));
        $('#imgShowTitle').text('Owner Image');
    })

    $(document).on('click', '.rideListCancelBtn', (e) => {
        swal({ title: 'Are you sure For Cancel?', type: 'info', showCancelButton: true })
            .then(function(accept) {
                    let txt = ($($(e.target).parent()).find('h6').text()).split(' ');
                    let id = txt[2];
                    $('#loadModel').modal('show');
                    $.post('http://localhost:3000/cancel', { email: userDetails.email, id: id }, (response) => {
                            $('#loadModel').modal('toggle');
                            $(e.target).attr('disabled', true);
                            swal("Canceled!", "Successfully Canceled Ride!", "success");
                            rideList('d', (err, ok) => {
                                if (err) console.log('Error');
                                else {
                                    rideNotification('d', (er, o) => {
                                        if (er) console.log('Error');
                                        else console.log('Done');
                                    })
                                }
                            })
                        })
                        .fail(err => {
                            $('#loadModel').modal('toggle');
                            if (err.responseJSON.status == 404) {
                                sweetAlert('Failed', 'This Ride Canceld By Owner');
                                $(e.target).attr('disabled', true);
                            } else if (err.responseJSON.status == 500)
                                sweetAlert('Failed', 'Internal Server Error! Try Again');
                            else
                                sweetAlert('Failed', 'Connection Error! Try Again');
                        })
                },
                function(dismiss) {
                    console.log('Dismis Cancel');
                })
    })
    $('#homePage').click(() => {
        window.location.href = 'http://localhost:3000/';
    })
})