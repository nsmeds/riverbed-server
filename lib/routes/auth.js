const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const token = require('../auth/token');
const User = require('../models/user');
const ensureAuth = require('../auth/ensure-auth')();

function hasUsernameAndPassword(req, res, next) {
    const user = req.body;
    if(!user.username || !user.password) {
        return next({
            code: 400,
            error: 'username and password required'
        });
    } 
    next();
}

router
    .get('/verify', ensureAuth, (req, res) => {
        res.status(200).send({ success: true });
    })
    // .get('/users', (req, res, next) => {
    //     User.find()
    //         .then(users => res.send(users))
    //         .catch(next);
    // })
    .post('/signup', bodyParser, hasUsernameAndPassword, (req, res, next) => {
        const data = req.body;
        delete req.body;

        User.find({ username: data.username }).count()
            .then(count => {
                if(count > 0) throw {
                    code: 400,
                    error: `username ${data.username} already exists`
                };

                return new User(data).save();
            })
            .then(user => token.sign(user))
            .then(token => res.send({ token }))
            .catch(next);
    })
    .post('/signin', bodyParser, hasUsernameAndPassword, (req, res, next) => {
        const { username, password } = req.body;
        delete req.body.password;
        User.findOne({ username })
            .then(user => {
                if (!user || !user.comparePassword(password)) {
                    throw({
                        code: 400,
                        error: 'Invalid username or password.'
                    });
                }
                return user;
                // return token.sign(user);
            })
            .then(user => token.sign(user))
            // .then(token => res.send({ token }))
            .then(profile => {
                res.send({
                    token: profile.token,
                    id: profile.payload.id,
                    username: profile.payload.username
                });
            })
            .catch(next);
    });

module.exports = router;