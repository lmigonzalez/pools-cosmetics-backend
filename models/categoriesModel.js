const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  letter: { type: String, required: true },
  //   picUrl: { type: String, required: true },
  picture: {
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
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('categories', categorySchema);
