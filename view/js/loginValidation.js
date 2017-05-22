$(document).ready(() => {
    if(localStorage.getItem('car_pol_user_details')){
        window.location.href = 'http://localhost:3000/landing';
    }
    console.log('Login Js Running..');
    let logemail = false;
    let logpas = false;
    let npass = false;
    let cpass = false;
    let emailRegx = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
    let passRegx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
    let otpRegx = new RegExp("^[0-9]{5,5}$");
    let obj;
    $('#loginAlert').hide();
    $('#forPasEmailForm').hide();
    $('#forOtpForm').hide();
    $('#setPasseordForm').hide();
    $('#logbtn').attr('disabled', true);
    $('#forEmailbtn').attr('disabled', true);
    $('#forOtpbtn').attr('disabled', true);
    $('#resetbtn').attr('disabled', true);
    console.log('Again Runnnn');

    function setLogDivText(msg) {
        $('#loginAlert').text(msg);
    }

    function checkLogValidation() {
        if (logemail == true && logpas == true) {
            console.log('Valid..');
            $('#logbtn').attr('disabled', false);
        } else {
            console.log('Invalid..');
            $('#logbtn').attr('disabled', true)
        }
    }

    function setLogParaText(para, msg) {
        if (para == 'em') $('#userText').text(msg);
        if (para == 'pas') $('#passText').text(msg);
    }

    $('#username').keyup(() => {
        if (emailRegx.test($('#username').val())) {
            logemail = true;
            setLogParaText('em', '');
            checkLogValidation();
        } else {
            logemail = false;
            setLogParaText('em', 'Enater Valid Username');
            checkLogValidation();
        }
    });
    $('#username').focusout(() => {
        if ($('#username').val() == '') {
            logemail = false;
            setLogParaText('em', 'Username Required');
            checkLogValidation();
        } else {
            if (emailRegx.test($('#username').val())) {
                logemail = true;
                setLogParaText('em', '');
                checkLogValidation();
            } else {
                logemail = false;
                setLogParaText('em', 'Enater Valid Username');
                checkLogValidation();
            }
        }
    });

    $('#password').keyup(() => {
        if (passRegx.test($('#password').val())) {
            logpas = true;
            setLogParaText('pas', '');
            checkLogValidation();
        } else {
            logpas = false;
            setLogParaText('pas', 'Min Length 6, Comnation Of Upperacse and Lowercase alphabate, Number and Special Symbol');
            checkLogValidation();
        }
    });
    $('#password').focusout(() => {
        if ($('#password').val() == '') {
            logpas = false;
            setLogParaText('pas', 'Password Required');
            checkLogValidation();
        } else {
            if (passRegx.test($('#password').val())) {
                logpas = true;
                setLogParaText('pas', '');
                checkLogValidation();
            } else {
                logpas = false;
                setLogParaText('pas', 'Min Length 6, Comnation Of Upperacse and Lowercase alphabate, Number and Special Symbol');
                checkLogValidation();
            }
        }
    });

    $('#logbtn').click(() => {
        $('#loginAlert').show();
        let logData = {
            'email': $('#username').val().trim().toLowerCase(),
            'password': $('#password').val()
        };
        $('#logbtn').attr('disabled', true);
        $('#forbtn').attr('disabled', true);
        setLogDivText('Wait, We Are In Process');
        $.post('http://localhost:3000/login', logData, (response) => {
                localStorage.setItem('car_pol_user_details', JSON.stringify(response.data));
                window.location.href = "http://localhost:3000/landingpage.html";
            })
            .fail(err => {
                if (err.responseJSON.status == 401) {
                    $('#loginAlert').show();
                    setLogDivText(err.responseJSON.err);
                    $('#logForm').hide();
                } else if (err.responseJSON.status == 404) {
                    $('#loginAlert').show();
                    setLogDivText(err.responseJSON.err);
                    $('#username').val();
                    $('#password').val();
                    $('#forbtn').attr('disabled', false);
                } else {
                    setLogDivText('Internal Server Error! Try Again');
                    $('#forbtn').attr('disabled', false);
                }
            })
    });

    $('#forbtn').click(() => {
        $('#logForm').hide();
        $('#forPasEmailForm').show();
        $('#loginAlert').hide();
    });

    $('#forEmailCanbtn').click(() => {
        $('#forPasEmail').val();
        $('#forPasEmailForm').hide();
        $('#loginAlert').hide();
        $('#logForm').show();
    });

    $('#forPasEmail').keyup(() => {
        if (emailRegx.test($('#forPasEmail').val())) {
            $('#emailText').val('');
            $('#forEmailSubbtn').attr('disabled', false);
        } else {
            $('#emailText').val('Enter Valid Email');
            $('#forEmailSubbtn').attr('disabled', true);
        }
    });
    $('#forPasEmail').focusout(() => {
        if ($('#forPasEmail').val() == '') {
            $('#emailText').val('Email Required');
            $('#forEmailSubbtn').attr('disabled', true);
        } else {
            if (emailRegx.test($('#forPasEmail').val())) {
                $('#emailText').val('');
                $('#forEmailSubbtn').attr('disabled', false);
            } else {
                $('#emailText').val('Enter Valid Email');
                $('#forEmailSubbtn').attr('disabled', true);
            }
        }
    });

    $('#forEmailSubbtn').click(() => {
        $('#loginAlert').show();
        $('#loginAlert').text('Wait, We Are In Process');
        $('#forEmailSubbtn').attr('disabled', true);
        $('#forEmailCanbtn').attr('disabled', true);
        obj = {
            'email': $('#forPasEmail').val().toLowerCase()
        };
        $.post('http://localhost:3000/sendotp', obj, (response) => {
            $('#forPasEmailForm').hide();
            $('#forOtpForm').show();
            $('#forOtpbtn').attr('disabled', true);
            $('#loginAlert').text('Enter 5-Digit Activation Code Send To Your Mail');
        }).fail(err => {
            if (err.responseJSON.status == 500) {
                $('#loginAlert').text(err.responseJSON.err + '!Try Again');
                $('#forEmailCanbtn').attr('disabled', false);
                $('#forEmailSubbtn').attr('disabled', false);
            } else if (err.responseJSON.status == 404) {
                $('#loginAlert').text('Please Enter Correct Email');
                $('#forPasEmail').val('');
                $('#forEmailCanbtn').attr('disabled', false);
                $('#forEmailSubbtn').attr('disabled', true);
            } else {
                $('#loginAlert').text('Connection Error! Try Again');
                $('#forEmailCanbtn').attr('disabled', false);
                $('#forEmailSubbtn').attr('disabled', false);
            }
        })
    });

    $('#forOtp').keyup(() => {
        if (otpRegx.test($('#forOtp').val())) {
            $('#otpText').text('');
            $('#forOtpbtn').attr('disabled', false);
        } else {
            $('#otpText').text('Enter Valid Code');
            $('#forOtpbtn').attr('disabled', true);
        }
    });
    $('#forOtp').focusout(() => {
        if ($('#forOtp').val() == '') {
            $('#otpText').text('5-Digit Code Required');
            $('#forOtpbtn').attr('disabled', true);
        } else {
            if (otpRegx.test($('#forOtp').val())) {
                $('#otpText').text('');
                $('#forOtpbtn').attr('disabled', false);
            } else {
                $('#otpText').text('Enter Valid Code');
                $('#forOtpbtn').attr('disabled', true);
            }
        }
    });

    $('#forOtpbtn').click(() => {
        $('#loginAlert').text('Wait, We Are In Process');
        $('#forOtpbtn').attr('disabled', true);
        $('#forOtpRsend').attr('disabled', true);
        obj.otp = $('#forOtp').val();
        $.post('http://localhost:3000/passverify', obj, (response) => {
                $('#forOtpForm').hide();
                $('#loginAlert').text('Reset Your Password');
                $('#setPasseordForm').show();
                $('#resetbtn').attr('disabled', true);
            })
            .fail(err => {
                if (err.responseJSON.status == 500) {
                    $('#loginAlert').text(err.responseJSON.err + '!Try Again');
                    $('#forOtpbtn').attr('disabled', false);
                    $('#forOtpRsend').attr('disabled', false);
                } else if (err.responseJSON.status == 404) {
                    $('loginAlert').text(err.responseJSON.err);
                    $('#forOtp').val('');
                    $('#forOtpbtn').attr('disabled', true);
                    $('#forOtpRsend').attr('disabled', false);
                } else {
                    $('loginAlert').text('Connection Problem..! Try Again');
                    $('#forOtp').val('');
                    $('#forOtpbtn').attr('disabled', false);
                    $('#forOtpRsend').attr('disabled', false);
                }
            })
    });

    $('#forOtpRsend').click(() => {
        $('#loginAlert').text('Wait, We Are In Process');
        $('#forOtpForm').hide();
        $.post('http://localhost:3000/sendotp', obj, (response) => {
                $('#loginAlert').text('Enter Code Which Send To Your Mail');
                $('#forOtpForm').show();
                $('#forOtp').text('');
                $('#forOtpbtn').attr('disabled', true);
            })
            .fail(err => {
                if (err.responseJSON.status == 500) {
                    $('#loginAlert').text(err.responseJSON.err + '! Try Again');
                    $('#forOtpForm').show();
                } else if (err.responseJSON.status == 404) {
                    $('#loginAlert').text('Email Not Found, Try Again');
                    $('#forPasEmailForm').show();
                    $('#forPasEmail').text('');
                    $('#forEmailSubbtn').attr('disabled', true);
                } else {
                    $('#loginAlert').text('Connection Error! Try Again');
                    $('#forOtpForm').show();
                }
            })
    });


    //FORGET PASSWORD
    function resetPassValidation() {
        if (npass == true && cpass == true) $('#resetbtn').attr('disabled', false);
        else $('#resetbtn').attr('disabled', true);
    }
    $('#npassword').keyup(() => {
        if (passRegx.test($('#npassword').val())) {
            npass = true;
            $('#npassText').text('');
            resetPassValidation();
        } else {
            npass = false;
            $('#npassText').text('Min Length 6 and combination of Upperacse and Lowercase, Number and Special Symbol');
            resetPassValidation();
        }
    });
    $('#npassword').focusout(() => {
        if ($('#npassword').val() == '') {
            npass = false;
            $('#npassText').text('New Password Required');
            resetPassValidation();
        } else {
            if (passRegx.test($('#npassword').val())) {
                npass = true;
                $('#npassText').text('');
                resetPassValidation();
            } else {
                npass = false;
                $('#npassText').text('Min Length 6 and combination of Upperacse and Lowercase, Number and Special Symbol');
                resetPassValidation();
            }
        }
    });

    $('#cpassword').keyup(() => {
        if ($('#npassword').val() == $('#cpassword').val()) {
            cpass = true;
            $('#cpassText').text('');
            resetPassValidation();
        } else {
            cpass = false;
            $('#cpassText').text('Password Should Be Match With New Password');
            resetPassValidation();
        }
    });
    $('#cpassword').focusout(() => {
        if ($('#cpassword').val() == '') {
            cpass = false;
            $('#cpassText').text('Retype Password');
            resetPassValidation();
        } else {
            if ($('#npassword').val() == $('#cpassword').val()) {
                cpass = true;
                $('#cpassText').text('');
                resetPassValidation();
            } else {
                cpass = false;
                $('#cpassText').text('Password Should Be Match With New Password');
                resetPassValidation();
            }
        }
    });

    $('#resetbtn').click(() => {
        $('#loginAlert').text('Wait, We Are In Process');
        $('#resetbtn').attr('disabled', true);
        obj.password = $('#cpassword').val();
        $.post('http://localhost:3000/resetpassword', obj, (response) => {
                alert('Password Reset Successfully, Sending To Login Page');
                $('#setPasseordForm').hide();
                $('#logForm').show();
                $('#username').val('');
                $('#password').val('');
                $('#logbtn').attr('disabled', false);
                $('#loginAlert').hide();
            })
            .fail(err => {
                if (err.responseJSON.status == 500) {
                    $('#loginAlert').text(err.responseJSON.err + '!Try Again');
                    $('#resetbtn').attr('disabled', false);
                } else if (err.responseJSON.status == 404) {
                    $('#loginAlert').text('Email OR CODE Invalid');
                    $('#resetbtn').attr('disabled', false);
                } else {
                    $('#loginAlert').text('Connection Error! Try Again');
                    $('#resetbtn').attr('disabled', false);
                }
            })
    })



})