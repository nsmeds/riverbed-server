const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const bodyParser = require('body-parser').json();

router
    .get('/', (req, res, next) => {
        Author.find(req.query)
            .select('name posts')
            .populate('posts', 'title issue author content bio')
            .lean()
            .then(authors => res.send(authors))
            .catch(err => {
                console.log('error getting authors: ', err);
                next(err);
            });
    })

    .get('/:id', (req, res, next) => {        
        Author.findById(req.params.id)
            .select('name posts bio')
            .populate('posts', 'title issue author content bio')
            .lean()
            .then(author => res.send(author))
            .catch(err => {
                console.log('error getting author by id: ', err);
                next(err);
            });
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