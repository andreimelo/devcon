const {
    express
} = require('../../src/lib/express');
const router = express.Router();
const auth = require('./../../middleware/auth');
const {
    validationResult
} = require('express-validator');
const {
    checkTextIsRequired
} = require('../../src/lib/express/validator');
const Post = require('../../models/Post');
const User = require('../../models/User');
const string = require('../../src/constants/string');

// @route  POST api/posts
// @desc   Create a post 
// @access Private

router.post('/', [auth, [checkTextIsRequired]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();

        res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send(string.generic.serverError);
    }
});

// @route  GET api/posts
// @desc   Get All post 
// @access Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({
            date: -1
        });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(string.generic.serverError);
    }
});

module.exports = router;