const {
    check,
} = require('express-validator');
const string = require('./../../../constants/string');

const checkNameIsRequired = check(string.users.name, string.users.nameIsRequired).not().isEmpty();
const checkEmailIsRequired = check(string.users.email, string.users.emailIsRequired).not().isEmpty();
const checkEmailIsInvalid = check(string.users.email, string.users.emailInvalidFormat);
const checkPasswordLength = check(string.users.password, string.users.passwordLength).isLength({
    min: 6
});

module.exports = {
    checkNameIsRequired,
    checkEmailIsRequired,
    checkEmailIsInvalid,
    checkPasswordLength
};