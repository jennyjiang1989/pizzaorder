var menu = require('../data/menu.json');

exports.sizeAmount=function(size){
  for (var i = 0; i<menu.size.length;i++){
    if(menu.size[i].type==size){
      var sizeAmou = parseInt(menu.size[i].amount);
      return sizeAmou;
    }
  }
}

exports.toppingsAmount=function(toppings){
  if (typeof toppings == "undefined"){
    return 0;
  }//if there is no topping, return 0 directly...
  else if (typeof toppings == "string"){
    toppings = [toppings];
  }//if there is only 1 topping, transfer to an Array, or the toppingsAmou is always 0...
    var toppingsAmou = 0;
     for (var i=0;i<toppings.length;i++){
       //console.log(toppings.length);
       for (var j=0;j<menu.toppings.length;j++){
         if (menu.toppings[j].type==toppings[i]){
            var eachAmou = parseInt(menu.toppings[j].amount);
            toppingsAmou+=eachAmou;
         }
       }
     }
     return toppingsAmou;
}

exports.finalPrice=function(sizeAmount, toppingsAmount, quantity){
  eachAmount = (sizeAmount+toppingsAmount)*1.05;
  finalAmount = eachAmount*quantity;
  finalAmou = finalAmount.toFixed(2);
  return finalAmou;
}
