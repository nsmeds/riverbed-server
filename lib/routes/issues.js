const express = require('express');
const router = express.Router();
const Issue = require('../models/issue');
const Post = require('../models/post');
const bodyParser = require('body-parser').json();

router
    .get('/', (req, res, next) => {
        Issue.find(req.query)
            .select('title posts')
            .populate('posts', 'title issue author content bio')
            .lean()
            .then(issues => res.send(issues))
            .catch(err => {
                console.log('error getting issues: ', err);
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

        // Issue.findById(req.params.id)
        //     .select('title posts')
        //     .populate('posts', 'title issue author content bio')
        //     .lean()
        //     .then(issue => res.send(issue))
        //     .catch(err => {
        //         console.log('error getting issue by id: ', err);
        //         next(err);
        //     });
    })

    .post('/', bodyParser, (req, res, next) => {
        new Issue(req.body).save()
            .then(saved => res.send(saved))
            .catch(err => {
                console.log('error - could not POST issue: ', err);
                next(err);
            });
    })

    .put('/:id', bodyParser, (req, res, next) => {
        Issue.findByIdAndUpdate(req.params.id, req.body)
            .then(saved => res.send(saved))
            .catch(err => {
                console.log('error - could not PUT issue: ', err);
                next(err);
            });
    })

    .delete('/:id', (req, res, next) => {
        Issue.findByIdAndRemove(req.params.id)
            .then(deleted => res.send(deleted))
            .catch(err => {
                console.log('error - could not DELETE issue: ', err);
                next(err);
            });
    });

module.exports = router;