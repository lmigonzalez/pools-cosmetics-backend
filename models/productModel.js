const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: String, required: true },
  categoryLetter: { type: String, required: true },
  categoryName: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number, required: true },
  description: { type: String, required: true },
  isActive : {type: Boolean, default: true},
  pictures: [
    {
      fileName: {
        type: String,
        required: true,
        unique: true,
      },
      fileSize: {
        type: Number,
        required: true,
        unique: false,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('products', productSchema);
