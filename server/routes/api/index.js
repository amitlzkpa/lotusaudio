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


const errHandler = function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send();
  }
  next();
};

router.use('/users', checkJwt, errHandler, require('./user'));



module.exports = router;