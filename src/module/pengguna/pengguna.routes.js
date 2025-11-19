const router = require('express').Router();
const controller = require('./pengguna.controller');
const validateDto = require('../../middlewares/validateDto');
const { createUserDto, updateUserDto, listUserQueryDto } = require('./pengguna.dto');
const { auth, role } = require('../../middlewares/auth');

// Hanya ADMIN yang boleh manage user
router.get('/', auth, role(['ADMIN']), validateDto(listUserQueryDto), controller.list);
router.get('/:id', auth, role(['ADMIN']), controller.detail);
router.post('/', auth, role(['ADMIN']), validateDto(createUserDto), controller.create);
router.patch('/:id', auth, role(['ADMIN']), validateDto(updateUserDto), controller.update);
router.delete('/:id', auth, role(['ADMIN']), controller.remove);

module.exports = router;
