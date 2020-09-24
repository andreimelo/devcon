const {
    check,
    validationResult
} = require('express-validator/check');
const string = require('./../../../constants/string');

const checkNameIsRequired = check(string.users.name, string.users.nameIsRequired).not().isEmpty();

const checkEmailIsInvalid = check(string.users.email, string.users.emailInvalidFormat)

module.exports = {
    checkNameIsRequired,
    checkEmailIsInvalid
};