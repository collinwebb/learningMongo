var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var MD5 = require('MD5');
var slug = require('slug');

mongoose.connect(process.env.MONGOLAB_URI);

// var User = mongoose.model("users", {name: String});
// // var user1 = new User({name: 'from Mongoose'});
// // user1.save();
// User.find({}, function(error, data){
//   console.log(data);
// });

var Question = mongoose.model("Question", {
  body: {type: String, required: true, unique: true},
  email: {type: String, required: true},
  createdAt: {type: Date, default: new Date()},
  slug: {type: String, required: true, unique: true},
  gravatarUrl: String,
  answers: [{
    body: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: Date, default: new Date()},
    gravatarUrl: String,
  }],
});

Question.on('index', function(error){
  if (error){
    console.log(error);
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mongo API' });
});

router.get('/tests', function(req, res, next) {
  res.render('tests');
});

router.post('/test', function(req, res, next) {
  var response = req.body;
  response.serverTime = new Date();
  console.log(response);
  res.json(response);
});

router.get('/questions', function(req, res){
  Question.find({}).sort({createdAt: -1}).limit(200).exec(function(error, data){
    if (error){
      res.status(400).json('could not read data');
    }
    res.json(data);
  });
});

router.post('/questions', function(req, res){
  var ask = new Question(req.body);
  ask.gravatarUrl = "http://www.gravatar.com/avatar/" + MD5(ask.email);
  ask.slug = slug(ask.body || "");
  ask.save(function(error, savedQuestion){
    if (error){
      res.status(400).json({error: 'validation failed'});
    }
    res.json(savedQuestion);
  });
});

router.get('/questions/:id', function(req, res, next) {
  Question.findOne({slug: req.params.id}, function(err, data) {
    if(!data){
      res.status(404).json({error: 'question does not exist'});
      return;
    }
    res.json(data);
  });
});

router.patch('/questions/:id', function(req, res, next) {
  Question.findOneAndUpdate({slug: req.params.id}, req.body, {new: true}, function(error, data){
    if (error){
      return;
    }
    if(!data){
      res.status(404).json({error: 'question does not exist'});
      return;
    }
    res.json(data);
  });
});

router.delete('/questions/:id', function(req, res, next) {
  Question.findOneAndRemove({slug: req.params.id}, function(error, data){
    if (error){
      return;
    }
    if(!data){
      res.status(404).json({error: 'question does not exist'});
      return;
    }
    res.json({message: "deleted"});
  });
});

router.post('/questions/:id/answers', function(req, res, next) {
  Question.findOne({slug: req.params.id}, function(error, data){
    if (error){
      res.status(400).json({error: 'could not find question'});
      return;
    }
    if(!data){
      res.status(404).json({error: 'question does not exist'});
      return;
    }
    var answer = req.body;
    answer.gravatarUrl = "http://www.gravatar.com/avatar/" + MD5(answer.email);
    question.answers.push(answer);
    question.save(function(error, data){
      if (error){
        res.status(400).json({error: 'could not save answer'});
      }
      res.json(data);
    });
  });
});

module.exports = router;
