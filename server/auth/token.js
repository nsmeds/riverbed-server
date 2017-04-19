const jwt = require('jsonwebtoken');
const scrt = process.env.SCRT;

module.exports = {
    sign(user) {
        return new Promise((resolve, reject) => {
            const payload = {
                id: user._id,
                username: user.username
            };
            const options = {
                'expiresIn': '1h'
            };

            jwt.sign(payload, scrt, options, (err, token) => {
                if (err) return reject('error signing token', err);
                const profile = {
                    token: token,
                    payload: payload
                };
                resolve(profile);
            });
        });
    },
    verify(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, scrt, (err, payload) => {
                if (err) return reject('error verifying token', err);
                resolve(payload);
            });
        });
    }
};


// const jwt = require('jsonwebtoken-promisified');
// const scrt = process.env.SCRT || 'scrt';

// module.exports = {
//     sign(user) {
//         const payload = {
//             id: user._id,
//             roles: user.roles
//         };
//         // returns token
//         return jwt.signAsync(payload, scrt);
//     },
//     verify(token) {
//         // returns payload
//         return jwt.verifyAsync(token, scrt);
//     }
// };
