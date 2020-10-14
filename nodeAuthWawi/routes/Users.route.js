const express = require('express');
const policies = require('../middleware/auth/auth-policies');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const users_controller = require('../controllers/Users.controller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/refreshToken', policies.loggedIn, users_controller.refresh_token);
router.get('/:id', policies.sameUserOrAdmin, users_controller.user_details);
router.post('/create', users_controller.user_create);
router.post('/resetPass', users_controller.reset_password_code);
router.post('/updatePass', users_controller.update_password);
router.post('/login', users_controller.user_login);
router.post('/:id/update', policies.sameUserOrAdmin, users_controller.user_update);

module.exports = router;