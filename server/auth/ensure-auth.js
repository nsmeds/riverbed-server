const token = require('./token');

module.exports = function getEnsureAuth() {
    return function ensureAuth(req, res, next) {
        if(req.method === 'OPTIONS') return next();
        const accessToken = req.get('Authorization');
        // console.log('ensure-auth accessToken', accessToken);
        // console.log('ensure-auth req.headers', req.headers);
        // console.log('ensure-auth req.body', req.body);
        // console.log('ensure-auth req.user', req.user);
        if(!accessToken) return next({ code: 400, error: 'Unauthorized, no token provided'});
        token.verify(accessToken)
            .then(payload => {
                req.user = payload;
                next();
            })
            .catch(() => {
                next({ code: 403, error: 'Unauthorized, bad token'});
            });
    };
};