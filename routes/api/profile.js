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
    checkSkillsIsRequired,
    checkTitleIsRequired,
    checkCompanyIsRequired,
    checkFromIsRequired,
    checkDegreeIsRequired,
    checkFieldOfStudyIsRequired,
    checkSchoolIsRequired
} = require('../../src/lib/express/validator');
const request = require('request');
const config = require('config');
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
        }
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
    }

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

// @route  GET api/profile
// @desc   Get all profile
// @access Public

router.get('/', async (req, res) => {
    try {
        const profile = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(string.generic.serverError);
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
            user: req.user.id
        });
        // Remove user 
        await User.findOneAndRemove({
            _id: req.user.id
        });
        res.json({
            msg: string.profile.profileDeleted
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).send(string.generic.serverError);
    }
});

// @route  PUT api/profile/experience
// @desc   Add profile experience 
// @access Private

router.put('/experience', [auth, [checkTitleIsRequired, checkCompanyIsRequired, checkFromIsRequired]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });


        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(string.generic.serverError);
    }

});

// @route  DELETE api/profile/experience/:exp_id
// @desc   delete profile experience 
// @access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send(string.generic.serverError);
    }
});

// @route  PUT api/profile/education
// @desc   Add profile education 
// @access Private

router.put('/education', [auth, [checkSchoolIsRequired, checkDegreeIsRequired, checkFieldOfStudyIsRequired, checkFromIsRequired]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        profile.education.unshift(newEdu);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(string.generic.serverError);
    }

});

// @route  DELETE api/profile/experience/:exp_id
// @desc   delete profile eduction 
// @access Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send(string.generic.serverError);
    }
});

// @route  GET api/profile/github/:username
// @desc   Get user repos from github
// @access Public

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: "GET",
            headers: {
                'user-agent': 'node.js'
            }
        }
        request(options, (err, response, body) => {
            if (err) console.error(err.message);

            if (response.statusCode !== 200) {
                return res.status(404).json({
                    msg: string.profile.githubNotFound
                });
            }
            let parseBody = JSON.parse(body)
            if (parseBody.length < 0) {
                res.status(404).json({
                    msg: string.profile.githubNotFound
                });
            }
            res.json(parseBody);
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(string.generic.serverError);
    }
});

module.exports = router;