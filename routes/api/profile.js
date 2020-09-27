const {
    express
} = require('../../src/lib/express');
const router = express.Router();
const auth = require('../../middleware/auth');
const string = require('../../src/constants/string');
const {
    validationResult,
} = require('express-validator');
const {
    checkStatusIsRequired,
    checkSkillsIsRequired
} = require('../../src/lib/express/validator');
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

// @route  POST api/profile
// @desc   Create or Update users profile
// @access Private

router.post('/', [auth, [checkStatusIsRequired, checkSkillsIsRequired]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    };

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    const profile_fields = {};
    profile_fields.user = req.user.id;
    if (company) profile_fields.company = company;
    if (website) profile_fields.website = website;
    if (location) profile_fields.location = location;
    if (bio) profile_fields.bio = bio;
    if (status) profile_fields.status = status;
    if (githubusername) profile_fields.githubusername = githubusername;
    if (skills) profile_fields.skills = skills.split(',').map(skill => skill.trim());
    profile_fields.social = {}
    if (youtube) profile_fields.social.youtube = youtube;
    if (facebook) profile_fields.social.facebook = facebook;
    if (twitter) profile_fields.social.twitter = twitter;
    if (instagram) profile_fields.social.instagram = instagram;
    if (linkedin) profile_fields.social.linkedin = linkedin;

    try {

        let profile = await Profile.findOne({
            user: req.user.id
        })

        if (profile) {
            profile = await Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profile_fields
            }, {
                new: true
            });
            return res.json(profile);
        }

        profile = new Profile(profile_fields);
        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send(string.generic.serverError)
    }
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({
                msg: string.profile.profileNotFound
            })
        }
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                msg: string.profile.profileNotFound
            })
        }
        res.status(500).send(string.generic.serverError);
    }
});

// @route  DELETE api/profile
// @desc   Delete profile, user & posts
// @access Private

router.delete('/', auth, async (req, res) => {
    try {

        // @todo  - Remove users posts
        // Remove profile
        await Profile.findOneAndRemove({
            user: req.user_id
        });
        // Remove user 
        await Profile.findOneAndRemove({
            _id: req.user_id
        });
        res.json({
            msg: string.profile.profileDeleted
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).send(string.generic.serverError);
    }
});

module.exports = router;