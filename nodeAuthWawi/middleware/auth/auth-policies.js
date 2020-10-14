const JWT = require('./jwt');

exports.loggedIn = function (req, res, next) {
    let decoded = JWT.verify(req, res, next);
    req.token = decoded;
    next();
}

exports.adminOnly = function (req, res, next) {
    let decoded = JWT.verify(req, res, next);
    req.token = decoded;
    if (req.token.roles.includes('Admin'))
        next();
    else
        res.status(401).json({
            message: "You are unauthorized to access this route"
        });
}

exports.sameUserOrAdmin = function(req, res, next) {
    let decoded = JWT.verify(req, res, next);
    req.token = decoded;
    if (req.token.roles.includes('Admin') || req.params.id == decoded.userId || req.params.userId == decoded.userId)
        next();
    else
        res.status(401).json({
            message: "You are unauthorized to access this route"
        });
}