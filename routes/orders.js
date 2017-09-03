var Order = require('../models/order');
var SecurityCode = require('../models/securityCode');
var priceCalculator = require('../models/priceCalculator.js');
var express = require('express');
var router = express.Router();

var menu = require('../data/menu.json');
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var sns = new AWS.SNS();

/* GET home page. */
router.get('/', function(req, res, next) {
  var menus = menu;
  var vm = {data:menus};
  res.render('index', vm);
});

router.get('/orders', function (req, res, next) {
    res.render('orders');
});


router.get('/orderID', function (req, res, next) {
    res.render('orderID');
});

//REST API
router.post('/api/generateConfirmCode', function(req, res, next) {
    var phone = req.body.phone;
    var code = Math.floor(1000 + Math.random() * 9000);

    var params = {
        Message: 'Pizza Order security code:' + code,
        MessageStructure: 'string',
        PhoneNumber: '+1'+phone
    };

    SecurityCode.update({
        phone: phone
    }, {
        phone: phone,
        code: code,
        date: new Date()
    }, {
        upsert: true
    }, function(err) {
        if (err) {
            console.log('Failed to save code to database' + err);
            res.json({
                'succeed': false,
                'message': 'System is under maintainance, please try again later'
            });
        } else {
            sns.publish(params, function(err, data) {
                if (err) {
                    console.log('Failed to send notification' + err);
                } else {
                    console.log('Send SMS to ' + phone + ' with result ' + JSON.stringify(data));
                }
            });
            res.json({
                'succeed':true,
                'message':'Please check your phone for security code'
            });
        }
    });
});

router.get('/api/orders', function (req, res, next) {
    console.log("Received a request for /api/orders");
    Order.find({}, function (err, orders) {
        if (err) {
            return next(err);
        }
        res.json(orders)
    });
});

router.post('/api/deleteOrder', function (req, res, next) {
    console.log('Delete order' + req.body.order);
    if (req.body.password != '654321') {
        res.json({'succeed': false, 'message': 'Invalid Administrator Password'});
    } else {
        Order.remove({ _id: req.body.order }, function(err) {
            if (err) {
                res.json({'succeed': false, 'message': err});
            }
            else {
                res.json({'succeed': true, 'message': ''});
            }
        });
    }
});

router.get('/api/orders/:orderid', function (req, res, next) {

    Order.findById(req.params.orderid, function (err, order) {
        if (err) {
            return next(err);
        }
        res.json(order)
    });
});

router.post('/api/orders', function (req, res, next) {
    console.log(req.body);

    var reqBody = req.body;
    var code = req.body.code;
    var sizeVal = req.body.size;
    var toppingsVal = req.body.toppings;
    var quantityVal = req.body.quantity;
    console.log("Toppings selected: " + toppingsVal); //undefined OR pepperoni OR an array
    var sizeAmou = priceCalculator.sizeAmount(sizeVal);
    console.log("price for size: " + sizeAmou);
    var toppingsAmou = priceCalculator.toppingsAmount(toppingsVal);
    console.log("price for toppings: " + toppingsAmou);
    var price = priceCalculator.finalPrice(sizeAmou,toppingsAmou,quantityVal);
    console.log("total price: " + price);

    var order = new Order({
        size: req.body.size,
        crust: req.body.crust,
        toppings: req.body.toppings,
        quantity: req.body.quantity,
        phone: req.body.phone,
        address: req.body.address,
        price: 'CAD'+ price,
        date: new Date()
    });
    console.log("The order details: " + order);

    if (!order.size || !order.crust || !order.quantity || !order.phone || !order.address) {
        res.status(400);
        return res.json({ "status": 400, "message": "Missing input data" });
    }
    SecurityCode.findOne({phone: req.body.phone}, function (err, securityCode) {
        console.log('check code ' + code);
        if (err) {
            return res.json({'status': 404, 'message': 'Invalid security code' + err});
        } else if (securityCode.code != code) {
            return res.json({'status': 404, 'message': 'Invalid security code'});
        }
        console.log("Input code" + code + " Real code" + securityCode.code);

        order.save(function (err) {
            if (err) {
                return res.status(500).json({ error: "Failed to save the order" });
            }
            else {
                return res.json({ "status": 200, "message": "Added new order" });
            }
        });

    });
});

module.exports = router;
