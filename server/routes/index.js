const apiSetup = require('./api');





const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;



function setup(app) {
  
  // these aren't really secrets
  app.get('/api/auth0-secrets', function(req, res) {
    const creds = {
      AUTH0_DOMAIN: AUTH0_DOMAIN,
      AUTH0_CLIENT_ID: AUTH0_CLIENT_ID
    };
    res.json(creds);
  });
  

  // api routes
  apiSetup.setup(app);

}



module.exports = {
  setup
};