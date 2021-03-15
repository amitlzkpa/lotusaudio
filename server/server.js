require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
// const PeerServer = require('peer').PeerServer;
const ExpressPeerServer = require('peer').ExpressPeerServer;
const swaggerAPIDocSetup = require('./configs/apidoc');

const DIR = 'dist';
const PORT = process.env.PORT || 8080;

const mongoURI = process.env.MONGO_URL;
mongoose.connect(mongoURI, { useNewUrlParser: true });

const app = express();

app.use(express.static(DIR));

app.use(cookieParser());
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

app.use("/", require('./routes'));

swaggerAPIDocSetup.setup(app);

const base = path.join(__dirname, '../');
const indexFilePath = path.join(base, '/dist/index.html');
app.use('/*', (req, res) => res.sendFile(indexFilePath));

const server = app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

const peerServer = ExpressPeerServer(server, {debug: true});
app.use('/peerjs', peerServer);

peerServer.on('error', (client) => {
	console.log('error');
});

peerServer.on('connection', (client) => {
	console.log(`The client ${client} is connected`);
});
