const router = require('express').Router();
const controller = require('./auth.controller');
const validateDto = require('../../middlewares/validateDto');
const { loginDto } = require('./auth.dto');
const { auth } = require('../../middlewares/auth');

router.post('/login', validateDto(loginDto), controller.login);
router.get('/getProfile', auth, controller.getProfile);

module.exports = router;
