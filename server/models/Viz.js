const mongoose = require('mongoose');


const VizSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    default: "<unnamed>"
  },
  visibility: {
    type: String,
    default: "private"
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  forker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  short_description: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  code: {
    type: String,
    default: ""
  },
  paymentPointer: {
    type: String,
    default: ""
  },
}, {timestamps: true});


module.exports = mongoose.model('Viz', VizSchema);