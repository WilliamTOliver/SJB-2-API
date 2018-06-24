const express = require('express');
const router = express.Router();

const AuthService = require('../services/auth');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', AuthService.signup);

router.post('/login', AuthService.login);

router.delete('/:userId', checkAuth, AuthService.delete);

module.exports = router;
