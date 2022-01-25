const express = require('express')
const router = express.Router();
const { Post } = require("../models/index");
const {body, validationResult} = require('express-validator');

const authCheck = (req, res, next) =>{
    if (!req.session.auth) {
        return res.status(400).send('UnAuthorization');
    }else{
        next();
    }
}

router.get('/post/:id', async (req, res) => {
    const post = await Post.findOne({
        where: {
            id: parseInt(req.params.id),
        },
    });

    if (post != null) {
        return res.status(200).send(post);
    } else {
        return res.status(404).send('Post not found');
    }
});

router.get('/post/delete/:id',
    authCheck,
    async (req, res) => {
    const post = await Post.destroy({
        where: {
            id: parseInt(req.params.id),
        },
    });
    console.log(post);
    if (post) {
        return res.status(200).send('Post has been deleted');
    }else{
        return res.status(404).send('Post not found');
    }
});

router.post('/post/save',
    authCheck,
    body('title').isLength({min: 3})
        .withMessage('Min Desc length should be < 5'),
    body('description').isLength({min: 5})
        .withMessage('Min Desc length should be < 5'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const result = await Post.create({
            title: req.body.title,
            description: req.body.description
        })

        console.log(result);
        return res.status(200).send('Post created');

    });

router.get('/posts',
    async (req, res) => {
    const posts = await Post.findAll();
    res.status(200).send(posts);
});

module.exports = router;
