$(function ready() {
    var id = getUrlParameter('id');
    var path = "/api/orders/"+id;
    $.getJSON(path, function (item) {
            $('#orders').append('<tr><td>' + item.size + '</td><td>' + item.crust + '</td><td>' + item.toppings + '</td><td>' + item.quantity + '</td><td>' + item.phone + '</td><td>' + item.address + '</td><td>' + item.price + '</td></tr>');
    });

});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
