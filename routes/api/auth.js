const {
    express
} = require('../../src/lib/express');
const router = express.Router();
const auth = require('./../../middleware/auth');
const string = require('./../../src/constants/string');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require("bcryptjs");
const {
    validationResult
} = require('express-validator');
const {
    checkEmailIsRequired,
    checkPasswordIsRequired
} = require('../../src/lib/express/validator');

// @route  GET api/auth
// @desc   User profile via token
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

// @route  POST api/auth
// @desc   Authenticate user & get token 
// @access Public

router.post('/', [checkEmailIsRequired, checkPasswordIsRequired],
    async (req, res) => {
        console.log(req.body)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const {
            email,
            password
        } = req.body;

        try {

            let user = await User.findOne({
                email
            })

            if (!user) {
                return res.status(400).json({
                    errors: [{
                        msg: string.auth.invalidEmailOrPass
                    }]
                })
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                return res.status(400).json({
                    errors: [{
                        msg: string.auth.invalidEmailOrPass
                    }]
                })
            }

            const payload = {
                user: {
                    id: user.id,
                }
            }

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000
            }, (err, token) => {
                if (err) console.log(err);
                res.json({
                    token,
                    msg: string.auth.userSuccessfullyLogin
                });
            });
        } catch (err) {
            console.error(err.message)
            res.status(500).send(string.generic.serverError)
        }
    });


module.exports = router;