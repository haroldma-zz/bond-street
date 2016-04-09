var mongoose = require('mongoose');

var formSchema = new mongoose.Schema({
  name: String,
  description: String,
  maxSteps: Number
}, { timestamps: true });

var Form = mongoose.model('Form', formSchema);

module.exports = Form;
