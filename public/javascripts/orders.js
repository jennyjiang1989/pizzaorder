function deleteOrder(orderId) {
    $('#hiddenOrderId').val(orderId);
    $('#myModal').modal('show');
    return false;
}
function ajaxDeleteOrder(event) {
    var orderId=$('#hiddenOrderId').val();
    var password=$('#password').val();
    $.ajax({
        url: '/api/deleteOrder',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            order: orderId,
            password: password
        }),
        success: function(json) {
            if (json.succeed) {
                $('#myModal').modal('hide');
                $("#order"+orderId).remove();
            } else {
                alert(json.message);
            }
        }
    });
}

$(function ready() {
    $("#deleteOrderButton").on('click', function(event) {
        ajaxDeleteOrder();
    });

    $.getJSON("/api/orders/", function (data) {
        data.forEach(function (item) {
            $('#orders').append('<tr id="order'+item._id+'"><td>' + item.size + '</td><td>' + item.crust + '</td><td>' + item.toppings + '</td><td>' + item.quantity + '</td><td>' + item.phone + '</td><td>' + item.address + '</td><td>' + item.price + '</td><td><a href="/orderID?id='+item._id+'">detail</a></td><td><a href="#" onclick="javascript:deleteOrder(\''+item._id+'\');">Delete</a></td></tr>');
        });
    });

});
