const router = require('express').Router();

const User = require('../../models/User');




/**
 * @swagger
 * path:
 *  /api/users/id/{id}:
 *    get:
 *      summary: Get a user by id.
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: User id to search.
 *      responses:
 *        "200":
 *          description: Stored user entry.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.get('/id/:id', async (req, res) => {
  let id = req.params.id;
  let user = await User.findOne({_id: id});
  return res.json(user);
});


/**
 * @swagger
 * path:
 *  /api/users/email/{email}:
 *    get:
 *      summary: Get a user by email.
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: email
 *          required: true
 *          description: Email to search.
 *      responses:
 *        "200":
 *          description: Stored user entry.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.get('/email/:email', async (req, res) => {
  let email = req.params.email;
  let user = await User.findOne({email: email});
  return res.json(user);
});


/**
 * @swagger
 * path:
 *  /api/users/username/{username}:
 *    get:
 *      summary: Get a user by username.
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: username
 *          required: true
 *          description: Username to search.
 *      responses:
 *        "200":
 *          description: Stored user entry.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.get('/username/:username', async (req, res) => {
  let username = req.params.username;
  let user = await User.findOne({username: username});
  return res.json(user);
});


/**
 * @swagger
 * path:
 *  /api/users/all:
 *    get:
 *      summary: Get all users.
 *      tags: [Users]
 *      responses:
 *        "200":
 *          description: All stored user entries.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.get('/all', async (req, res) => {
  let users = await User.find({});
  return res.json(users);
});


/**
 * @swagger
 * path:
 *  /api/users/:
 *    post:
 *      summary: Create a new user. Returns existing user of same name if found.
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: Stored user entry.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.post('/', async (req, res) => {
  const u = req.body;
  if (!u || u === {}) {
    return res.status(400).send();
  }
  let user = await User.findOne({ username: u.nickname });
  if (user) {
    return res.json(user);
  }
  user = new User({
    username: u.nickname,
    name: u.name,
    email: u.email
  });
  user = await user.save();
  return res.json(user);
});




router.get('/test', function(req, res) {
  console.log('Test user route');
  return res.send('Test user route');
});



module.exports = router;