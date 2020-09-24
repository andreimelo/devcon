const {
    express
} = require('../../src/lib/express');
const router = express.Router();

// @route  GET api/posts
// @desc   Test route 
// @access Public
router.get('/', (req, res) => res.send("Posts Route"));

module.exports = router;