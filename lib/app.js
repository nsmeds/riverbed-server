const express = require('express');
const app = express();
const errorHandler = require('./error-handler');

const content = require('./routes/content')
const issues = require('./routes/issues');
const users = require('./routes/users');
const authors = require('./routes/authors');
const auth = require('./routes/auth');

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

app.use(express.static('./public'));
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/issues', issues);
app.use('/api/authors', authors);
app.use('/api/content', content);

app.use(errorHandler);

module.exports = app;
