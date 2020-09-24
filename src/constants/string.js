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
    auth: {
        noTokenAuth: "No token, authorization denied",
        tokenNotValid: "Token is not valid"
    },
    users: {
        userAlreadyExists: "User already exists",
        userSuccessfullyRegistered: "User has successfully registered",
        name: "name",
        email: "email",
        password: "password",
        nameIsRequired: "Name is required",
        emailIsRequired: "Email is required",
        emailInvalidFormat: "Please include a valid email",
        passwordLength: "Please enter a password with 6 or more characters",
    }
}

module.exports = string;