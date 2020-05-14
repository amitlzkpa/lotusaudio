require('dotenv').config();
const mongoose = require('mongoose');



/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          _id:
 *            type: ObjectId
 *            description: Unique identifier automatically added to the user.
 *          name:
 *            type: String
 *            default: ""
 *          email:
 *            type: String
 *            default: ""
 *            description: Email for the user, needs to be unique.
 *          username:
 *            type: String
 *            description: Username for the user, needs to be unique.
 *          bio:
 *            type: String
 *            description: A descriptive bio for the user.
 *          permissions:
 *            type: Object
 *            description: An object representing the true/false permission values for keys.
 *                         By default contains a permission set for 'admin' set to false.
 *        example:
 *           username: pparker
 *           name: Peter Parker
 *           email: pp_is_stuck@web.com
 *           bio: My spidey sense tingles if you don't write docs.
 *           permissions: { admin: true, read: true, write: false }
 */

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  name: {
    type: String,
    index: true,
    default: ""
  },
  email: {
    type: String,
    index: true,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  permissions: {
    admin: {
      type: Boolean,
      default: false
    }
  }
}, {timestamps: true});



module.exports = mongoose.model('User', UserSchema);