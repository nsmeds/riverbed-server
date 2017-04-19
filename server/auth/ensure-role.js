module.exports = function getEnsureRole(role) {
    return function ensureRole(req, res, next) {
        const roles = req.user.roles;
        if(roles && roles.indexOf && roles.indexOf(role) > -1) next();
        else next({
            code: 403,
            error: 'Unauthorized'
        });
    };
};

// module.exports = function getEnsureRole(...roles) {

//     const lookup = roles.reduce((lookup, role) => {
//         lookup[role] = true;
//         return lookup;
//     }, Object.create(null));

//     return function ensureRole(req, res, next) {
//         const userRoles = req.user.roles;

//         if (userRoles && userRoles.some(role => lookup[role])) {
//             next();
//         } else {
//             next({
//                 code: 403,
//                 error: 'Unauthorized, invalid role'
//             });
//         }
//     };
// };