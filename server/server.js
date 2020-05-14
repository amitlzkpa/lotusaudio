require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const apiDocSetup = require('./configs/apidoc');

const DIR = 'dist';
const PORT = process.env.PORT || 8080;

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;

const mongoURI = process.env.MONGO_URL;
mongoose.connect(mongoURI, { useNewUrlParser: true });

const app = express();
app.use(express.static(DIR));

app.use(cookieParser());
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

app.get('/api/auth0-secrets', function(req, res) {
  const creds = {
    AUTH0_DOMAIN: AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: AUTH0_CLIENT_ID
  };
  res.json(creds);
});

app.use('/api', require('./routes/api'));

apiDocSetup.setup(app);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});