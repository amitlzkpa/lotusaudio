const router = require('express').Router();



const ensureSecure = function (req, res, next) {
  console.log("Putting on a thin layer of protection here.");
  next();
}


router.use(ensureSecure);


router.get('/test', function(req, res) {
  console.log('Test route');
  return res.send('Test route');
});


router.use('/users', require('./user'));

module.exports = router;