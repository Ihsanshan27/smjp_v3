const router = require('express').Router();
const controller = require('./prodi.controller');
const validateDto = require('../../../middlewares/validateDto');
const { auth, role } = require('../../../middlewares/auth');
const {
    listProdiQueryDto,
    createProdiDto,
    updateProdiDto,
} = require('./prodi.dto');

// list/detail: semua user login
router.get('/', auth, validateDto(listProdiQueryDto), controller.list);
router.get('/:id', auth, controller.detail);

// modify: ADMIN & TU_FAKULTAS
router.post('/', auth, role(['ADMIN', 'TU_FAKULTAS']), validateDto(createProdiDto), controller.create);
router.patch('/:id', auth, role(['ADMIN', 'TU_FAKULTAS']), validateDto(updateProdiDto), controller.update);
router.delete('/:id', auth, role(['ADMIN', 'TU_FAKULTAS']), controller.remove);

module.exports = router;
