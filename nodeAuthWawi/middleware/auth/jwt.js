let jwt = require('jsonwebtoken');

exports.sign = function(user) {
    var payload = {
        id: user._id,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        allowExplicit: user.allowExplicit,
        roles: user.roles || [],
        showQuizPlayer: user.showQuizPlayer,
        pauseSongOnTranslate: user.pauseSongOnTranslate
    };

    var signOptions = {
        expiresIn: "5d",
        algorithm: "HS256"
    };

    try {
        return jwt.sign(payload, process.env.JWT_PrivateKey, signOptions);
    }
    catch(err) {
    }
}

exports.verify = function(req, res) {
    let token = req.headers['x-access-token'] || req.headers['authorization']; 
    if(token == null) {
        res.status(403).json({
            message: "No auth token provided"
        });
    }
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);

        try {
            return jwt.verify(token, process.env.JWT_PrivateKey);
        } catch (err) {
            res.status(403).json({
                message: "Auth token is not valid"
            });
        }
    }
}

exports.decode = function(token) {
    return jwt.decode(token, { complete: true });
}
