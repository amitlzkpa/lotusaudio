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
  let auth0User = req.user;
  let user = await User.findOne({username: auth0User.nickname});
  req.auth0User = auth0User;
  req.user = user;
  next();
}




// public routes
router.get('/test', function(req, res) {
  console.log('Test route');
  return res.send('Test route');
});


// protected routes
router.use('/users', [checkJwt, errHandler, addUserToReq], require('./user'));




module.exports = router;