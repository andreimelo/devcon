const string = {
    generic: {
        serverError: "Server Error"
    },
    gravatar: {
        s200: "200",
        rpg: "pg",
        dmm: "mm"
    },
    mongodb: {
        isConnected: "MongoDB is Connected",
        isDisconnected: "MongoDB is Disconnected"
    },
    profile: {
        noProfileUser: "There is no profile for this user",
        profileNotFound: "Profile not found",
        status: "status",
        skills: "skills",
        statusIsRequired: "Status is required",
        skillsIsRequired: "Skills is required"
    },
    auth: {
        noTokenAuth: "No token, authorization denied",
        tokenNotValid: "Token is not valid",
        invalidEmailOrPass: "Invalid email or password",
        userSuccessfullyLogin: "User has successfully login",
    },
    users: {
        userAlreadyExists: "User already exists",
        userSuccessfullyRegistered: "User has successfully registered",
        name: "name",
        email: "email",
        password: "password",
        nameIsRequired: "Name is required",
        passwordIsRequired: "Password is required",
        emailIsRequired: "Email is required",
        emailInvalidFormat: "Please include a valid email",
        passwordLength: "Please enter a password with 6 or more characters",
    }
}

module.exports = string;