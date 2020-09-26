const {
    check,
} = require('express-validator');
const string = require('../../../constants/string');

const checkNameIsRequired = check(string.users.name, string.users.nameIsRequired).not().isEmpty();
const checkEmailIsRequired = check(string.users.email, string.users.emailIsRequired).not().isEmpty();
const checkEmailIsInvalid = check(string.users.email, string.users.emailInvalidFormat);
const checkPasswordIsRequired = check(string.users.password, string.users.passwordIsRequired).notEmpty();
const checkPasswordLength = check(string.users.password, string.users.passwordLength).isLength({
    min: 6
});
const checkStatusIsRequired = check(string.profile.status, string.profile.statusIsRequired).not().isEmpty();
const checkSkillsIsRequired = check(string.profile.skills, string.profile.skillsIsRequired).not().isEmpty();
module.exports = {
    checkNameIsRequired,
    checkEmailIsRequired,
    checkEmailIsInvalid,
    checkPasswordIsRequired,
    checkPasswordLength,
    checkStatusIsRequired,
    checkSkillsIsRequired
};