const {
    express
} = require('../../src/lib/express');
const router = express.Router();
const auth = require('../../middleware/auth');
const string = require('../../src/constants/string');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route  GET api/profile/me
// @desc    Get current users profile
// @access Private

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({
                msg: string.profile.noProfileUser
            })
        };
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send(string.generic.serverError);
    }
});

module.exports = router;