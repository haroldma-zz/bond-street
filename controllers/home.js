var Form = require('../models/Form');

exports.index = function(req, res) {
  Form.find({}, function(err, forms) {
    if (!err){
      if (forms.length === 0) {
        // seeding db
        var form = new Form({'name':'Sample form', 'description': 'A sample for for the app.', 'maxSteps': 5});
        form.save();
        forms.push(form);
        form = new Form({'name':'Another form', 'description': 'You can only have one active form.', 'maxSteps': 9});
        form.save();
        forms.push(form);
      }
      res.render('home', {
        title: 'Home',
        forms: forms
      });
    } else {throw err;}
  });
};
