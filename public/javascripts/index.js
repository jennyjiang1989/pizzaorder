function showError(msg) {
    $('#statusMsg').removeClass();
    $('#errorMessage').removeClass();
    $('#errorMessage').addClass('alert alert-danger');
    $('#errorMessage').html('Error adding the order: '+msg);
    console.log('Request failed : '+msg);
}
$(function ready() {
    $("#generateConfirmCode").on('click', function(event) {
        $.ajax({
            url: '/api/generateConfirmCode',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({'phone':$('#phone').val()}),
            success: function(json, status, request) {
                console.log(json);
                if (json.succeed) {
                    $('#myModal').modal('show');
                } else {
                    alert(json.message);
                }
            }
        });
    });
    $("#placeOrder").on('click', function (event) {
        event.preventDefault();
        var selected = [];
        $('.toppingGroup input:checked').each(function() {
            selected.push($(this).val());
        });
        
        console.log("selected: " + selected);
        var orderInfo = JSON.stringify({
            size: $('#size').val(),
            crust: $('#crust').val(),
            toppings: selected,
            quantity: $('#quantity').val(),
            phone: $('#phone').val(),
            code: $('#securityCode').val(),
            address: $('#address').val()
        });

        $.ajax({
            url: '/api/orders',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: orderInfo,
            success: function (json, status, request) {
                if (json.status == 200) {
                    $('#statusMsg').removeClass();
                    $('#statusMsg').addClass('alert alert-success');
                    $('#statusMsg').html('Added the order');
                    $('#myModal').modal('hide');
                } else {
                    showError(json.message);
                }
            },
            error: function (request, status, error) {
                showError(error);
            }
        });

    });
});
