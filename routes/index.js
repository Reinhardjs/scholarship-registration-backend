var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', (req,res) => {
  res.json({
    message: 'scholarship index'
  })
})

module.exports = router;
