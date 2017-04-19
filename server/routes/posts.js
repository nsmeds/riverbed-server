const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const bodyParser = require('body-parser').json();
const ensureAuth = require('../auth/ensure-auth')();
const ensureRole = require('../auth/ensure-role');

router
    .get('/', (req, res, next) => {
        const query = {};
        if(req.query.userId) query.userId = req.query.userId;
        Post.find(query)
            .populate('author issue', 'name bio title')
            .lean()
            .then(posts => res.send(posts))
            .catch(err => {
                console.log('error getting posts: ', err);
                next(err);
            });
    })
    .get('/:id', (req, res, next) => {
        Post.findById(req.params.id)
            .select('title author issue text bio')
            .populate('author issue', 'name bio title')
            .lean()
            .then(post => res.send(post))
            .catch(err => {
                console.log('error getting post: ', err);
                next(err);
            });
    })
    .post('/', ensureAuth, ensureRole('admin'), bodyParser, (req, res, next) => {
        new Post(req.body).save()
            .then(newPost => {
                Post.findById(newPost._id)
                    .populate('author issue', 'name bio title')
                    .then(populated => res.send(populated))
                    .catch(err => next(err));
            })
            .catch(err => {
                console.log('error - could not POST post: ', err);
                next(err);
            });
    })
    .put('/:id', bodyParser, (req, res, next) => {
        Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(err => {
                console.log('error - could not PUT post: ', err);
                next(err);
            });
    })
    .delete('/:id', (req, res, next) => {
        Post.findByIdAndRemove(req.params.id)
            .then(deleted => res.send(deleted))
            .catch(err => {
                console.log('error - could not DELETE post: ', err);
                next(err);
            });
    });

module.exports = router;