var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/sign', function(req, res, next) {
  res.render('sign', { title: 'Express' });
});

router.get('/api/getList', function(req, res) {
  // console.log(req, res)
  console.log('getList 통과되는지')
  res.send('api getList');
});
module.exports = router;
