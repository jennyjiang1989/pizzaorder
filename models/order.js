var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var OrderSchema = new Schema({
  size: String,
  crust: String,
  toppings: [String],
  quantity: Number,
  phone: String,
  address: String,
  price: String,
  state: String,
  date:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
