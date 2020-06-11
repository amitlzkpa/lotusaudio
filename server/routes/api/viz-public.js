const router = require('express').Router();

const Viz = require('../../models/Viz');


router.get('/id/:id', async (req, res) => {
  let id = req.params.id;
  let viz = await Viz.findOne({_id: id}).populate('author').exec();
  return res.json(viz);
});


router.get('/userid/:userid', async (req, res) => {
  let id = req.params.userid;
  let viz = await Viz.find({author: id}).populate('author').exec();
  return res.json(viz);
});


router.get('/all', async (req, res) => {
  let vizs = await Viz.find({visibility: "public"}).populate('author').exec();
  return res.json(vizs);
});


module.exports = router;