const router = require('express').Router();
const controller = require('./dosen.controller');
const validateDto = require('../../../middlewares/validateDto');
const { auth, role } = require('../../../middlewares/auth');
const { listDosenQueryDto, createDosenDto, updateDosenDto } = require('./dosen.dto');

// list/detail: semua user login
router.get('/', auth, validateDto(listDosenQueryDto), controller.list);
router.get('/:id', auth, controller.detail);

// manage dosen: ADMIN & TU (fak/prodi)
router.post('/', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(createDosenDto), controller.create);
router.patch('/:id', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(updateDosenDto), controller.update);
router.delete('/:id', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), controller.remove);

module.exports = router;