const express = require('express');
const app = express();
const errorHandler = require('./error-handler');

const auth = require('./routes/auth');
// const users = require('./routes/users');
const posts = require('./routes/posts');
const issues = require('./routes/issues');
const authors = require('./routes/authors');

if(process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if(req.headers['x-forwarded-proto'] === 'https') next();
        else res.redirect(`'https://${req.hostname}${req.url}`);
    });
}

app.use((req, res, next) => {
    const url = '*';
    res.header('Access-Control-Allow-Origin', url);
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
    next();
});

app.use(express.static('../../riverbed/dist'));
app.use('/api/auth', auth);
// app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/issues', issues);
app.use('/api/authors', authors);

app.use(errorHandler);

module.exports = app;
