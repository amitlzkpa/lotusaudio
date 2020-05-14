const router = require('express').Router();

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const User = require('../../models/User');


const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://amitlzkpa.auth0.com/.well-known/jwks.json"
  }),
  audience: "OJGLK6iqjY4sBlrhtOCAaOuUOMkXLd7h",
  issuer: "https://amitlzkpa.auth0.com/",
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