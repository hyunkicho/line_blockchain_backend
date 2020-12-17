var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/sign', function(req, res, next) {
  res.render('sign', { title: 'Express' });
});

router.get('/autherror', function(req, res, next) {
  res.render('autherror');
});
router.get('/loginerror', function(req, res, next) {
  res.render('loginerror', {rp:req.query.rp});
});

router.get('/login',  function(req, res, next) {
  res.render('login', {rp:req.query.rp});
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});



router.get('/api/getList', function(req, res) {
  // console.log(req, res)
  console.log('getList 통과되는지')
  res.send('api getList');
});
module.exports = router;
