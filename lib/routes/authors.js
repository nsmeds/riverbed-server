const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Post = require('../models/post');
const bodyParser = require('body-parser').json();
const ensureRole = require('../auth/ensure-role');

router
    .get('/', (req, res, next) => {
        Author.find(req.query)
            .select('name posts')
            .populate('posts', 'title issue author text bio')
            .lean()
            .then(authors => res.send(authors))
            .catch(err => {
                console.log('error getting authors: ', err);
                next(err);
            });
    })

    .get('/:id', (req, res, next) => {   

        const id = req.params.id;

        Promise.all([
            Author.findById(id).lean(),
            Post.find({ author: id }).populate('author issue', 'name title').lean()
        ])
        .then(([author, posts]) => {
            if(!author) throw {
                code: 404,
                error: `author ${id} does not exist`
            };
            author.posts = posts;
            res.send(author);
        })
        .catch(next);

        // Author.findById(req.params.id)
        //     .select('name posts bio')
        //     .populate('posts', 'title issue author text bio')
        //     .lean()
        //     .then(author => res.send(author))
        //     .catch(err => {
        //         console.log('error getting author by id: ', err);
        //         next(err);
        //     });
    })

    .post('/', bodyParser, (req, res, next) => {
        new Author(req.body).save()
            .then(saved => res.send(saved))
            .catch(err => {
                console.log('error - could not POST author: ', err);
                next(err);
            });
    })

    .put('/:id', bodyParser, (req, res, next) => {
        Author.findByIdAndUpdate(req.params.id, req.body)
            .then(saved => res.send(saved))
            .catch(err => {
                console.log('error = could not PUT author: ', err);
                next(err);
            });
    })

    .delete('/:id', (req, res, next) => {
        Author.findByIdAndRemove(req.params.id)
            .then(deleted => res.send(deleted))
            .catch(err => {
                console.log('error - could not DELETE issue: ', err);
                next(err);
            });
    });

module.exports = router;