const mongoose = require('mongoose');
const JWT = require('../middleware/auth/jwt');
const bcrypt = require('bcrypt');
const email = require('../middleware/email');

const User = require('../models/user.model');


exports.user_create = function (req, res) {
    let user = new User(req.body);
    user._id = mongoose.Types.ObjectId();
    user.email = user.email.toLowerCase();
    user.password = bcrypt.hashSync(req.body.password, 10);

    user.save(function (err) {
        if (err) {
            res.status(500).send(err);

            return;
        }
        res.json({
            created: user
        });
    })
};

exports.user_details = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) res.status(404).json({
            message: 'User not found'
        });
        else
            res.send(user);
    })
};

exports.user_update = async function (req, res) {
    let user = await User.findById(req.params.id).exec();

    user.firstname = req.body.firstname || user.firstname;
    user.lastname = req.body.lastname || user.lastname;
    user.email = req.body.email.toLowerCase() || user.email;
    user.save(function (err, doc) {
        if (err) res.status(500).send(err);
        else res.send();
    });
};

exports.user_login = function (req, res) {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ email: email.toLowerCase() }, { firstname: 1, lastname: 1, password: 1, roles: 1, email: 1, _id: 1 }).exec()
        .then(user => {
            if (!user) res.status(401).json({
                message: "Incorrect username or password"
            });
            else {
                bcrypt.compare(password, user.password, function (err, same) {
                    if (same) {
                        const decoded = JWT.sign(user);
                        res.status(200).json({
                            token: decoded
                        });
                    } else {
                        res.status(401).json({
                            message: "Incorrect username or password"
                        });
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).send();
        });
}

exports.refresh_token = async function (req, res) {
    User.findOne({ _id: req.token.id }).exec()
        .then(user => {
            const decoded = JWT.sign(user);
            res.status(200).json({
                token: decoded
            });
        })
        .catch(err => {
            res.status(500).send(err);
        });
}


exports.reset_password_code = async function (req, res) {
    // generate new code 
    let user = await User.findOne({ email: req.body.email }).exec();
    if (user === null) res.status(500).send();
    else {
        let code = Math.random().toString(36).substring(7);
        user["tempCredentials"] = {
            code: code,
            validUntil: new Date(new Date().getTime() + 30 * 60000)
        }

        user.save()
            .then(res => {
                let body = `Hi, \nThis is a password reset email, to reset your password please enter the link and fill out the form. \nPlease note this link will only work for the following 30 minutes, if you wish to reset your password after that please request another link. \nhttps://singit.io/auth/update?code=${code}`;
                email.send(user.email, "Password Reset", body);
                res.send();
            })
            .catch(err => {
                res.status(500).send(err);
            });
    }
}

exports.update_password = async function (req, res) {
    let user = await User.findOne({ 'tempCredentials.code': req.body.code }).exec();
    if (!user) res.status(500).send();
    else {
        if (new Date() < user.tempCredentials.validUntil) {
            user.password = bcrypt.hashSync(req.body.password, 10);
            user.save()
            .then(result => {
                res.send();
            })
            .catch(err => {
                res.status(500).send();
            });
        }
        else {
            res.status(500).send();
        }
    }
}



