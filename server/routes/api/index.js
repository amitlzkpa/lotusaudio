const router = require('express').Router();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');


// public routes

router.get('/test', function(req, res) {
  console.log('Test route');
  return res.send('Test route');
});


// protected routes

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://amitlzkpa.auth0.com/.well-known/jwks.json"
  }),
  audience: "OJGLK6iqjY4sBlrhtOCAaOuUOMkXLd7h",
  issuer: "https://amitlzkpa.auth0.com/",
  algorithms: ['RS256']
});

router.use('/users', checkJwt, require('./user'));

module.exports = router;