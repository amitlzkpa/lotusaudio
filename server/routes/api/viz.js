const router = require('express').Router();

const User = require('../../models/User');
const Viz = require('../../models/Viz');




router.get('/id/:id', async (req, res) => {
  let id = req.params.id;
  let viz = await Viz.findOne({_id: id}).populate('author').exec();
  return res.json(viz);
});


router.get('/all', async (req, res) => {
  let vizs = await Viz.find({});
  return res.json(vizs);
});


router.post('/new', async (req, res) => {
  let data = req.body;
  data.author = req.user;
  let viz = new Viz(data);
  viz = await viz.save();
  return res.json(viz);
});


router.post('/save', async (req, res) => {
  let data = req.body;
  let viz = await Viz.findOne({_id: data.id});
  viz.name = data.name || viz.name;
  viz.visibility = data.visibility || viz.visibility;
  viz.short_description = data.short_description || viz.short_description;
  viz.description = data.description || viz.description;
  viz.code = data.code || viz.code;
  viz.audioSources = data.audioSources || viz.audioSources;
  viz.paymentPointer = data.paymentPointer || viz.paymentPointer;
  viz.paymentEnabled = data.paymentEnabled || viz.paymentEnabled;
  viz = await viz.save();
  return res.json(viz);
});


module.exports = router;