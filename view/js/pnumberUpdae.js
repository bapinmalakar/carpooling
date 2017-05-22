$(document).ready(() => {
    console.log('Run P Load...');
    let pNumberRegx = new RegExp("^[1-9][0-9]{9}$");
    let user_details = JSON.parse(localStorage.getItem('car_pol_user_details'));
    $('#editNumber').click(() => {
        $('#phoneNumberEdin').ready(() => {
            $('#pUpdateBtn').attr('disabled', true);
            $('#pnumber').val(user_details.phoneNumber);
            $('#pupdatealert').hide();
            if (typeof user_details.alterNumber == undefined || user_details.alterNumber == 'No' || user_details.alterNumber == 'no')
                $('#alterPNumber').val('');
            else $('#alterPNumber').val(user_details.alterNumber)
        });
    })

    $('#pnumber').keyup(() => {
        if (pNumberRegx.test($('#pnumber').val())) {
            $('#phoneUpdateText').text('');
            $('#pUpdateBtn').attr('disabled', false);
        } else {
            $('#phoneUpdateText').text('Enter Valid Phone Number');
            $('#pUpdateBtn').attr('disabled', true);;
        }
    })
    $('#pnumber').focusout(() => {
        if ($('#pnumber').val() == '') {
            $('#phoneUpdateText').text('Phone Number Required');
            $('#pUpdateBtn').attr('disabled', true);
        } else {
            if (pNumberRegx.test($('#pnumber').val())) {
                $('#phoneUpdateText').text('');
                $('#pUpdateBtn').attr('disabled', false);
            } else {
                $('#phoneUpdateText').text('Enter Valid Phone Number');
                $('#pUpdateBtn').attr('disabled', true);;
            }
        }
    });

    $('#alterPNumber').keyup(() => {
        if ($('#alterPNumber').val() == '') {
            $('#AlterPhoneUpdateText').text('');
            $('#pUpdateBtn').attr('disabled', false);
        } else if (pNumberRegx.test($('#alterPNumber').val())) {
            $('#AlterPhoneUpdateText').text('');
            $('#pUpdateBtn').attr('disabled', false);
        } else {
            $('#AlterPhoneUpdateText').text('Enter Valid Phone Number');
            $('#pUpdateBtn').attr('disabled', true);;
        }
    })
    $('#alterPNumber').focusout(() => {
        if ($('#alterPNumber').val() == '') {
            $('#AlterPhoneUpdateText').text('');
            $('#pUpdateBtn').attr('disabled', false);
        } else {
            if (pNumberRegx.test($('#alterPNumber').val())) {
                $('#AlterPhoneUpdateText').text('');
                $('#pUpdateBtn').attr('disabled', false);
            } else {
                $('#AlterPhoneUpdateText').text('Enter Valid Phone Number');
                $('#pUpdateBtn').attr('disabled', true);;
            }
        }
    })

    $('#pUpdateBtn').click(() => {
        $('#pUpdateBtn').attr('disabled', true);
        $('#pupdatealert').show();
        $('#pupdatealert').text('Wait, We Are In Processing..');
        let obj = {};
        if ($('#alterPNumber').val() == '' && user_details.phoneNumber != $('#pnumber').val()) {
            obj.alterNumber = 'No';
            obj.pnumber = $('#pnumber').val();
        } else if ($('#alterPNumber').val() != '') {
            obj.alterNumber = $('#alterPNumber').val();
            obj.pnumber = $('#pnumber').val();
        } else {
            obj.pnumber = '';
        }
        if (obj.pnumber != '') {
            obj.email = user_details.email;
            console.log('Data Send: ', obj);
            $.post('http://localhost:3000/updatenumber', obj, (response) => {
                    console.log('Response: ', response);
                    user_details.phoneNumber = obj.pnumber;
                    user_details.alterNumber = obj.alterNumber;
                    $('#pupdatealert').text('');
                    $('#pupdatealert').hide();
                    $('#phoneNumberEdit .close').click();
                    JSON.stringify(localStorage.setItem('car_pol_user_details', user_details));
                    swal({
                        title: 'Updated',
                        text: 'Contact Information Update',
                        type: 'success'
                    })
                })
                .fail((err) => {
                    console.log('Error is: ', err);
                    if (err.responseJSON.status == 500)
                        sweetAlertShow('Internal Server Error! Try Again');
                    else if (err.responseJSON.status == 404) {
                        sweetAlertShow('Your Email Not Found..');
                        window.location.href = 'http://localhost:3000/login';
                    } else if (err.responseJSON.status == 422) {
                        $('#pupdatealert').text('This Number Already Exist');
                        $('#pnumber').val('');
                        $('#pUpdateBtn').attr('disabled', true);
                    } else sweetAlertShow('Connection Problem! Try Again');
                })
        } else {
            console.log('else');
            $('#phoneNumberEdit .close').click();
            alert('Not Need To Update, Because No Change');
        }

    })

    function sweetAlertShow(msg) {
        $('#phoneNumberEdit .close').click();
        swal({
            title: 'Failed',
            text: msg,
            type: 'error'
        })
    }
})