function deleteOrder(orderId) {
    $('#hiddenOrderId').val(orderId);
    $('#action').html('Delete Order');
    $('#myModal').modal('show');
    return false;
}
function deliverOrder(orderId) {
    $('#hiddenOrderId').val(orderId);
    $('#action').html('Deliver Order');
    $('#myModal').modal('show');
    return false;
}
function ajaxUpdateOrder() {
    if ($('#action').html() == 'Delete Order') {
        ajaxDeleteOrder();
    } else {
        ajaxDeliverOrder();
    }
}
function ajaxDeliverOrder() {
    var orderId=$('#hiddenOrderId').val();
    var password=$('#password').val();
    $.ajax({
        url: '/api/deliverOrder',
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
                $("#orderState"+orderId).html('Delivered');
                $("#orderDeliver"+orderId).html('-');
            } else {
                alert(json.message);
            }
        }
    });
}

function ajaxDeleteOrder() {
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
        ajaxUpdateOrder();
    });

    $.getJSON("/api/orders/", function (data) {
        data.forEach(function (item) {
            var orderHtml = '<tr id="order'+item._id+'">'
                    + '<td id="orderState'+item._id+'">' + item.state + '</td>'
                    + '<td>' + item.size + '</td>'
                    + '<td>' + item.crust + '</td>'
                    + '<td>' + item.toppings + '</td>'
                    + '<td>' + item.quantity + '</td>'
                    + '<td>' + item.phone + '</td>'
                    + '<td>' + item.address + '</td>'
                    + '<td>' + item.price + '</td>'
                    + '<td><a href="/orderID?id='+item._id+'">detail</a></td>'
                    + '<td><a href="#" onclick="javascript:deleteOrder(\''+item._id+'\');">Delete</a></td>'
                    + '<td id="orderDeliver'+item._id+'">';
            if (item.state == 'Delivered') {
                orderHtml += '-';
            } else {
                orderHtml += '<a href="#" onclick="javascript:deliverOrder(\''+item._id+'\');">Deliver</a>'
            }
            orderHtml += '</td></tr>';
            $('#orders').append(orderHtml);
        });
    });
});
