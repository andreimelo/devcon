const {
    express
} = require('../../src/lib/express');
const {
    validationResult
} = require('express-validator/check');
const {
    checkNameIsRequired,
    checkEmailIsRequired,
    checkEmailIsInvalid,
    checkPasswordLength
} = require('../../src/lib/express/validator/users');
const router = express.Router();

// @route  POST api/users
// @desc   Register User
// @access Public
router.post('/', [checkNameIsRequired, checkEmailIsRequired, checkEmailIsInvalid, checkPasswordLength], (req, res) => {
    console.log(req.body)
    res.send("Users Route");
});

module.exports = router;