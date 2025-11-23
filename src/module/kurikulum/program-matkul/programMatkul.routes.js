const router = require('express').Router();
const controller = require('./programMatkul.controller');
const validateDto = require('../../../middlewares/validateDto');
const { auth, role } = require('../../../middlewares/auth');
const {
    listProgramMatkulQueryDto,
    createProgramMatkulDto,
    updateProgramMatkulDto,
} = require('./programMatkul.dto');

router.get('/', auth, validateDto(listProgramMatkulQueryDto), controller.list);
router.get('/:id', auth, controller.detail);
router.post('/', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(createProgramMatkulDto), controller.create);
router.patch('/:id', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(updateProgramMatkulDto), controller.update);
router.delete('/:id', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), controller.remove);

module.exports = router;
