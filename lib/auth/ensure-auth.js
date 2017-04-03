const token = require('./token');

module.exports = function getEnsureAuth() {
    return function ensureAuth(req, res, next) {
        if(req.method === 'OPTIONS') return next();
        // const accessToken = req.headers.authorization;
        const accessToken = req.get('Authorization');
        if(!accessToken) return next({ code: 400, error: 'Unauthorized, no token provided'});
        token.verify(accessToken)
            .then(payload => {
                req.user = payload;
                console.log('logged in');
                next();
            })
            .catch(() => {
                next({ code: 403, error: 'Unauthorized, bad token'});
            });
    };
};