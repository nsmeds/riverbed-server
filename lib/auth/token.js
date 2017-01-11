const jwt = require('jsonwebtoken');
const sekrit = process.env.RV_SECRET;

module.exports = {
    sign(user) {
        return new Promise((resolve, reject) => {
            const payload = {
                id: user._id,
                username: user.username
            };

            jwt.sign(payload, sekrit, null, (err, token) => {
                if (err) return reject(err);
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
            jwt.verify(token, sekrit, (err, payload) => {
                if (err) return reject(err);
                resolve(payload);
            });
        });
    }
};