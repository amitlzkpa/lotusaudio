const router = require('express').Router();

const User = require('../../models/User');
const Viz = require('../../models/Viz');




router.get('/id/:id', async (req, res) => {
  let id = req.params.id;
  let viz = await Viz.findOne({_id: id});
  return res.json(viz);
});


router.get('/all', async (req, res) => {
  let vizs = await Viz.find({});
  return res.json(vizs);
});


router.post('/new', async (req, res) => {
  let data = req.body;
  console.log(data);
  data.visibility = "public";
  data.author = req.user;
  let v = new Viz(data);
  v = await v.save();
  return res.json(v);
});


module.exports = router;