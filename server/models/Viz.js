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
  paymentEnabled: {
    type: Boolean,
    default: false
  },
}, {timestamps: true});


module.exports = mongoose.model('Viz', VizSchema);