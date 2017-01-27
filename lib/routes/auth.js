const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const token = require('../auth/token');
const User = require('../models/user');
const ensureAuth = require('../auth/ensure-auth')();

router
    .post('/signin', bodyParser, (req, res, next) => {
        const { username, password } = req.body;
        delete req.body.password;
        User.findOne({ username })
            .then(user => {
                if (!user || !user.compareHash(password)) {
                    throw({
                        code: 400,
                        error: 'Invalid username or password.'
                    });
                }
                return token.sign(user);
            })
            .then(profile => {
                res.send({
                    token: profile.token,
                    id: profile.payload.id,
                    username: profile.payload.username
                });
            })
            .catch(next);
    })
    .get('/verify', ensureAuth, (req, res) => {
        res.status(200).send({ success: true });
    });

module.exports = router;