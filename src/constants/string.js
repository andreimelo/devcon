const string = {
    generic: {
        serverError: "Server Error",
        userNotAuthorized: "User not authorized"
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
    post: {
        textIsRequired: "Text is required",
        postNotFound: "Post not found",
        postRemoved: "Post removed",
        postAlreadyLiked: "Post already liked",
        unlikePost: "Unlike post",
        commentNotExist: "Comment does not exist",
    },
    profile: {
        noProfileUser: "There is no profile for this user",
        profileNotFound: "Profile not found",
        profileDeleted: "User profile deleted",
        status: "status",
        skills: "skills",
        title: "title",
        company: "company",
        from: "from",
        school: "school",
        degree: "degree",
        text: "text",
        fieldofstudy: "fieldofstudy",
        statusIsRequired: "Status is required",
        skillsIsRequired: "Skills is required",
        titleIsRequired: "Title is required",
        companyIsRequired: "Company is required",
        fromDateIsRequired: "From date is required",
        schoolIsRequired: "School is required",
        degreeIsRequired: "Degree is required",
        fieldOfStudyIsRequired: "Field of study is required",
        githubNotFound: "Github Profile Not Found"
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