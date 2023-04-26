const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  note: { type: String, required: false },
  products: [
    {
      productId: { type: String, required: true },
      productName: { type: String, required: true },
      productPrice: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  orderTotal: { type: Number, required: true },
  date: {
    type: Date,
    default: Date.now(),
    get: (date) => {
      date.toLocalString('en-US', { timeZone: 'America/New_York' });
    },
  },
});

module.exports = mongoose.model('orders', orderSchema);
