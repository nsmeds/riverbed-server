const express = require('express');
const router = express.Router();
const Issue = require('../models/issue');
const Post = require('../models/post');
const bodyParser = require('body-parser').json();
const ensureAuth = require('../auth/ensure-auth')();
const ensureRole = require('../auth/ensure-role');

router

    .get('/', (req, res, next) => {
        Issue.find({})
            .then(issues => {
                return Promise.all(
                    issues.map(issue => {
                        return Post.find({issue: issue._id})
                            .populate('author issue', 'name bio title text')
                            .then(posts => {
                                issue.posts = posts;
                                return issue;
                            });
                    })
                );
            })
            .then(issues => {
                res.send(issues);
            })
            .catch(err => {
                console.log('error - could not GET all issues: ', err);
                next(err);
            });
    })

    .get('/:id', (req, res, next) => {
        
        const id = req.params.id;

        Promise.all([
            Issue.findById(id).lean(),
            Post.find({ issue: id }).populate('author issue', 'name title').lean()
        ])
        .then(([issue, posts]) => {
            if(!issue) throw {
                code: 404,
                error: `issue ${id} does not exist`
            };
            issue.posts = posts;
            res.send(issue);
        })
        .catch(next);
    })

    .post('/', ensureAuth, ensureRole('admin'), bodyParser, (req, res, next) => {
        new Issue(req.body).save()
            .then(saved => res.send(saved))
            .catch(err => {
                console.log('error - could not POST issue: ', err);
                next(err);
            });
    })

    .put('/:id', bodyParser, (req, res, next) => {

        const id = req.params.id;

        Promise.all([
            Issue.findByIdAndUpdate(id, req.body, {new: true}).lean(),
            Post.find({ issue: id }).populate('author issue', 'name bio title text').lean()
        ])
        .then(([issue, posts]) => {
            if(!issue) throw {
                code: 404,
                error: `issue ${id} does not exist`
            };
            issue.posts = posts;
            res.send(issue);
        })
        .catch(err => {
            console.log('error - could not PUT issue: ', err);
            next(err);
        });
    })

    .delete('/:id', ensureAuth, ensureRole('admin'), (req, res, next) => {
        Issue.findByIdAndRemove(req.params.id)
            .then(deleted => res.send(deleted))
            .catch(err => {
                console.log('error - could not DELETE issue: ', err);
                next(err);
            });
    });

module.exports = router;