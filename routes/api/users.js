const {
    express
} = require('../../src/lib/express');
const {
    validationResult
} = require('express-validator');
const {
    checkNameIsRequired,
    checkEmailIsRequired,
    checkEmailIsInvalid,
    checkPasswordLength
} = require('../../src/lib/express/validator/users');
const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require("bcryptjs");
const User = require('./../../models/User');
const string = require('../../src/constants/string');

// @route  POST api/users
// @desc   Register User
// @access Public

router.post('/', [checkNameIsRequired, checkEmailIsRequired, checkEmailIsInvalid, checkPasswordLength],
    async (req, res) => {
        console.log(req.body)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const {
            name,
            email,
            password
        } = req.body;

        try {

            let user = await User.findOne({
                email
            })

            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: string.users.userAlreadyExists
                    }]
                })
            }

            const avatar = gravatar.url(email, {
                s: string.gravatar.s200,
                r: string.gravatar.rpg,
                d: string.gravatar.dmm,
            });

            user = new User({
                name,
                email,
                avatar,
                password
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                }
            }

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000
            }, (err, token) => {
                if (err) console.log(err);
                res.json({
                    token,
                    msg: string.users.userSuccessfullyRegistered
                });
            });
        } catch (err) {
            console.error(err.message)
            res.status(500).send(string.generic.serverError)
        }
    });

module.exports = router;