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

// @route  GET api/posts/:id
// @desc   Get post by id 
// @access Private


router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                msg: string.post.postNotFound
            });
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);

        if (err.kind === "ObjectId") {
            return res.status(404).json({
                msg: string.post.postNotFound
            });
        }

        res.status(500).send(string.generic.serverError);
    }
});

// @route  DELETE api/posts/:id
// @desc   Delete a post 
// @access Private


router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                msg: string.post.postNotFound
            });
        }

        // Check on user 
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
                msg: string.generic.userNotAuthorized
            })
        }

        await post.remove();

        res.json({
            msg: "Post removed"
        });
    } catch (err) {
        console.error(err.message);

        if (err.kind === "ObjectId") {
            return res.status(404).json({
                msg: string.post.postNotFound
            });
        }

        res.status(500).send(string.generic.serverError);
    }
});

// @route  PUT api/posts/like/:id
// @desc    Like a post
// @access Private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({
                msg: string.post.postAlreadyLiked
            })
        }

        post.likes.unshift({
            user: req.user.id
        });

        await post.save();

        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send(string.generic.serverError);
    }
});

// @route  PUT api/posts/unlike/:id
// @desc   Unlike a post
// @access Private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({
                msg: string.post.unlikePost
            })
        }

        // Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send(string.generic.serverError);
    }
});


module.exports = router;