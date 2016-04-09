var Form = require('../models/Form');


exports.index = function(req, res) {
  if (!req.user.currentStep._form) {
    return res.redirect('/');
  }
  return res.redirect('/steps/' + req.user.currentStep.step);
};

exports.done = function(req, res) {
  res.render('steps/done', {
    title: "Done!"
  });
};

exports.start = function(req, res) {
  Form.findById(req.params.id, function (err, form) {
       if (!form){
         res.status(404).send('Not found');
       } else{
           req.user.currentStep._form = form._id;
           req.user.currentStep.step = 1;
           req.user.save();
           res.redirect('/steps');
       }
   });
};

exports.step = function(req, res) {
  if (!req.user.currentStep._form) {
    return res.redirect('/');
  }

  Form.findById(req.user.currentStep._form, function (err, form) {
          if (req.params.id > req.user.currentStep.step || req.params.id < 1){
            return res.redirect('/steps');
          }

          res.render('steps/progressing', {
            title: "Steps",
            currentStep: req.params.id,
            maxStep: req.user.currentStep.step,
            steps: form.maxSteps,
            name: form.name,
          });
    });
};


exports.nextStep = function(req, res) {
  if (!req.user.currentStep._form) {
    return res.redirect('/');
  }

  Form.findById(req.user.currentStep._form, function (err, form) {
          if (req.params.id > req.user.currentStep.step + 1 || req.params.id < 1){
            return res.redirect('/steps');
          }

          // if they're coming from the current set step, then increment by one
          var next = req.user.currentStep.step;
          if (req.params.id == next) {
            next++;
            req.user.currentStep.step = next;
            req.user.save();
          }

          // done navigating all steps
          if (next > form.maxSteps) {
            req.user.currentStep._form = null;
            req.user.currentStep = {};
            req.user.save();
            return res.redirect('/steps/done');
          }

          return res.redirect('/steps/' + next);
    });
};
