var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('reinhard fullstack');
});

router.get('/me', (req,res,next) => {
  res.send('hello world')
})

module.exports = router;
