const router = require('express').Router();
const controller = require('./kelompokKelas.controller');
const validateDto = require('../../../middlewares/validateDto');
const { auth, role } = require('../../../middlewares/auth');
const { listKelasQueryDto, createKelasDto, updateKelasDto } = require('./kelompokKelas.dto');

router.get('/', auth, validateDto(listKelasQueryDto), controller.list);
router.get('/:id', auth, controller.get);

router.post('/', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(createKelasDto), controller.create);
router.patch('/:id', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(updateKelasDto), controller.update);
router.delete('/:id', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), controller.remove);

module.exports = router;