const router = require('express').Router()
const matkulController = require('./mataKuliah.controller')
const validateDto = require('../../../middlewares/validateDto')
const { auth, role } = require('../../../middlewares/auth')
const {
    listMatkulQueryDto,
    createMatkulDto,
    updateMatkulDto
} = require('./mataKuliah.dto')

router.get('/', auth, validateDto(listMatkulQueryDto), matkulController.list);
router.get('/:id', auth, matkulController.detail);

router.post('/', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(createMatkulDto), matkulController.create);
router.patch('/:id', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(updateMatkulDto), matkulController.update);
router.delete('/:id', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), matkulController.remove);

module.exports = router;