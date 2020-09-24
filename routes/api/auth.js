const {
    express
} = require('../../src/lib/express');
const router = express.Router();
const auth = require('./../../middleware/auth');
const string = require('./../../src/constants/string');
const User = require('../../models/User');

// @route  GET api/auth
// @desc   Test route 
// @access Public

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(string.generic.serverError);
    }
});

module.exports = router;