const router = require('express').Router();

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const User = require('../../models/User');


const AUTH0_JWKS_URI = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`;
const AUTH0_TOKEN_ISSUER = `https://${process.env.AUTH0_DOMAIN}/`;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;


const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: AUTH0_JWKS_URI
  }),
  audience: AUTH0_CLIENT_ID,
  issuer: AUTH0_TOKEN_ISSUER,
  algorithms: ["RS256"]
});


const errHandler = async function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(403).json({
      success: false,
      message: err.message || 'Failed to authenticate token.'
    });
  }
  next();
};



const addUserToReq = async function(req, res, next) {
  let userEmail = req.headers.email;
  let user = await User.findOne({email: userEmail.toLowerCase()});
  if (user) {
    req.user = user;
  }
  next();
}




// public routes
router.get('/test', function(req, res) {
  console.log('Test route');
  return res.send('Test route');
});


// protected routes
router.use('/vizs', [checkJwt, errHandler, addUserToReq], require('./viz'));
router.use('/users', [checkJwt, errHandler, addUserToReq], require('./user'));




module.exports = router;