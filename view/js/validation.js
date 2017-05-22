$(document).ready(() => {
    console.log(' Validation Script Is Running.....');
    let pass = false;
    let email = false;
    let name = false;
    let pnumber = false;
    let gender = false;
    let genderVal = "";
    let nameRegx = new RegExp('^[a-zA-Z ]+$');
    let emailRegx = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
    let passRegx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
    let pNumberRegx = new RegExp("^[1-9][0-9]{9}$");
    let otpRegx = new RegExp("^[0-9]{5,5}$");
    let obj;

    $('#otpForm').hide();
    $('#signForm').show();
    $('#signbtn').attr('disabled', true);
    $('#signAlert').hide();

    //signup Validation

    function disable() {
        $('#signbtn').attr('disabled', true);
    }

    function checkValidFun() {
        if (pnumber == true && pass == true && email == true && name == true) {
            if (gender == true) {
                setParatext('gd', '');
                $('#signbtn').attr('disabled', false);
            } else {
                setParatext('gd', 'Select Gender Please');
                $('#signbtn').attr('disabled', true);
            }
        } else $('#signbtn').attr('disabled', true);
    }

    $('#name').keyup(() => {
        let val = $('#name').val();
        if (nameRegx.test(val)) {
            name = true;
            setParatext('nam', '');
            checkValidFun();
        } else {
            name = false;
            setParatext('nam', 'Enter Valid Name');
            disable();
        }
    });

    $('#name').focusout(() => {
        if ($('#name').val() == '' || $('#name').val() == null) {
            name = false;
            setParatext('nam', 'Enter Name');
        } else {
            if (nameRegx.test($('#name').val())) {
                name = true;
                setParatext('nam', '');
                checkValidFun();
            } else {
                name = false;
                setParatext('nam', 'Enter Valid Name');
                disable();
            }
        }
    });

    $('#email').keyup(() => {
        if (emailRegx.test($('#email').val())) {
            email = true;
            setParatext('em', '');
            checkValidFun();
        } else {
            email = false;
            setParatext('em', 'Enter Valid email');
            disable();
        }
    });
    $('#email').focusout(() => {
        if ($('#email').val() == '' || $('#email').val() == null) {
            email = false;
            setParatext('em', 'Email Required');
            disable();
        } else {
            if (emailRegx.test($('#email').val())) {
                email = true;
                setParatext('em', '');
                checkValidFun();
            } else {
                email = false;
                setParatext('em', 'Enter Valid Email');
                disable();
            }
        }
    });

    $('#pnumber').keyup(() => {
        if (pNumberRegx.test($('#pnumber').val())) {
            pnumber = true;
            setParatext('num', '');
            checkValidFun();
        } else {
            pnumber = false;
            setParatext('num', 'Number Only Digit, Not Start With 0 and 10 Digit Long');
            disable();
        }
    });
    $('#pnumber').focusout(() => {
        if ($('#pnumber').val() == '') {
            pnumber = false;
            setParatext('num', 'Phone Number Required');
            disable();
        } else {
            if (pNumberRegx.test($('#pnumber').val())) {
                pnumber = true;
                setParatext('num', '');
                checkValidFun();
            } else {
                pnumber = false;
                setParatext('num', 'Number Only Digit, Not Start With 0 and 10 Digit Long');
                disable();
            }
        }
    });

    $('#pass').keyup(() => {
        if (passRegx.test($('#pass').val())) {
            pass = true;
            setParatext('pass', '');
            checkValidFun();
        } else {
            pass = false;
            setParatext('pass', 'Min Length: 6, Mix of Lowercase, Uppercase Alphabate and Number and Special Chracter');
            disable();
        }
    });
    $('#pass').focusout(() => {
        if ($('#pass').val() == "") {
            pass = false;
            setParatext('pass', 'Password Required');
            disable();
        } else {
            if (passRegx.test($('#pass').val())) {
                pass = true;
                setParatext('pass', '');
                checkValidFun();
            } else {
                pass = false;
                setParatext('pass', 'Min Length: 6, Mix of Lowercase, Uppercase Alphabate and Number and Special Chracter');
                disable();
            }
        }
    });

    $('#male').click(() => {
        gender = true;
        genderVal = 'male';
        setParatext('gd', '');
        checkValidFun();
    });

    $('#female').click(() => {
        gender = true;
        genderVal = 'female';
        setParatext('gd', '');
        checkValidFun();
    })

    function setParatext(p, msg) {
        if (p == 'nam') $('#natext').text(msg);
        if (p == 'em') $('#etext').text(msg);
        if (p == 'num') $('#ntext').text(msg);
        if (p == 'pass') $('#ptext').text(msg);
        if (p == 'gd') $('#gtext').text(msg);
    }

    $('#signbtn').click(() => {
        obj = {
            'name': $('#name').val().toUpperCase(),
            'email': $('#email').val().toLowerCase(),
            'phoneNumber': $('#pnumber').val(),
            'gender': genderVal.toUpperCase(),
            'password': $('#pass').val()
        };
        console.log('Data Are: ', obj);
        signup(obj)

    });

    $('#otpin').keyup(() => {
        if (otpRegx.test($('#otpin').val())) {
            $('#otptext').text('');
            $('#otpbtn').attr('disabled', false);
        } else {
            $('#otptext').text('Only 5-Digit Code');
            $('#otpbtn').attr('disabled', true);
        }
    });
    $('#otpin').focusout(() => {
        if ($('#otpin').val == "") {
            $('#otptext').text('5-Digit Code Required');
            $('#otpbtn').attr('disabled', true);
        } else {
            if (otpRegx.test($('#otpin').val())) {
                $('#otptext').text('');
                $('#otpbtn').attr('disabled', false);
            } else {
                $('#otptext').text('Only 5-Digit Code');
                $('#otpbtn').attr('disabled', true);
            }
        }
    });

    $('#rsend').click(() => {
        $('#otpin').val();
        $('#otpForm').hide();
        setSignAlert('Wait We Are Sending New 5-Digit Code, To Your Mail');
        $('#rsend').attr('disabled', true);
        $.post('http://localhost:3000/resendotp', obj, (response) => {
                setSignAlert('Type 5-Digit Code Send To Your Mail');
                $('#otpForm').show();
                $('#rsend').attr('disabled', false);
                $('#otpin').text('');
                $('#otpbtn').attr('disabled', true);
            })
            .fail(err => {
                setSignAlert('Not Able To Send Code! Try Again');
                $('#otpForm').show();
                $('#rsend').attr('disabled', false);
            })
    });

    $('#otpbtn').click(() => {
        $('#otpbtn').attr('disabled', true);
        $('#rsend').attr('disabled', true);
        obj.otp = $('#otpin').val().trim();
        console.log('Send Data: ', obj);
        setSignAlert('Wait! We Are In Process');
        $.post('http://localhost:3000/verifyotp', obj, (response) => {
                localStorage.setItem('car_pol_user_details', JSON.stringify(response.data));
                window.location.href = "http://localhost:3000/landing";
            })
            .fail(err => {
                if (err.responseJSON.status == 500) setSignAlert(err.responseJSON.err + '! Try Again');
                else setSignAlert(err.responseJSON.err);
                $('#otpbtn').attr('disabled', false);
                $('#rsend').attr('disabled', false);
            })
    })

    function signup(obj) {
        $('#signbtn').attr('disabled', true);
        $('#signAlert').show();
        setSignAlert('Wait, We Are In Procesing');
        $.post('http://localhost:3000/register', obj, (data, status) => {
            setSignAlert('');
            $('#signForm').hide();
            $('#otpForm').show();
            $('#otpbtn').attr('disabled', true);
            $('#signAlert').show();
            setSignAlert('Enter 5-Digit Code For Active Your Account');


        }).fail((err) => {
            setSignAlert(err.responseJSON.err);
            if (err.responseJSON.status == 422 && err.responseJSON.errType == 1) {
                $('#signForm').attr('disabled', false);
                $('#signbtn').attr('disabled', true);
                $('#email').val('');
            } else if (err.responseJSON.status == 422 && err.responseJSON.errType == 2) {
                $('#signForm').attr('disabled', false);
                $('#signbtn').attr('disabled', true);
                $('#pnumber').val('');
            } else $('#signbtn').attr('disabled', false);
        })
    };

    function setSignAlert(msg) {
        $('#signAlert').text(msg);
    }
    $('#loginLink').click(() => {
        if (localStorage.getItem('car_pol_user_details')) {
            window.location.href = "http://localhost:3000/landing";
        } else
            window.location.href = "http://localhost:3000/login";
    })
    $('#findrideLink').click(() => {
        if (localStorage.getItem('car_pol_user_details')) {
            window.location.href = "http://localhost:3000/landing";
        } else window.location.href = "http://localhost:3000/login";
    })
    $('#offerRideLink').click(() => {
        if (localStorage.getItem('car_pol_user_details')) {
            window.location.href = "http://localhost:3000/landing";
        } else window.location.href = "http://localhost:3000/login";
    })
})