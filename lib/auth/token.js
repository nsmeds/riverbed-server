const jwt = require('jsonwebtoken-promisified');
const wbtkn = process.env.WBTKN || 'wbtkn';

module.exports = {
    sign(user) {
        const payload = {
            id: user._id,
            roles: user.roles
        };
        // returns token
        return jwt.signAsync(payload, wbtkn);
    },
    verify(token) {
        // returns payload
        return jwt.verifyAsync(token, wbtkn);
    }
};


// const jwt = require('jsonwebtoken');
// const sekrit = process.env.RV_wbtkn;

// module.exports = {
//     sign(user) {
//         return new Promise((resolve, reject) => {
//             const payload = {
//                 id: user._id,
//                 username: user.username
//             };

//             jwt.sign(payload, sekrit, null, (err, token) => {
//                 if (err) return reject(err);
//                 const profile = {
//                     token: token,
//                     payload: payload
//                 };
//                 resolve(profile);
//             });
//         });
//     },
//     verify(token) {
//         return new Promise((resolve, reject) => {
//             jwt.verify(token, sekrit, (err, payload) => {
//                 if (err) return reject(err);
//                 resolve(payload);
//             });
//         });
//     }
// };