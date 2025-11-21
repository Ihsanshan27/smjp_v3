const router = require('express').Router();
const controller = require('./kurikulum.controller');
const validateDto = require('../../../middlewares/validateDto');
const { auth, role } = require('../../../middlewares/auth');
const {
    createKurikulumDto,
    updateKurikulumDto,
    listKurikulumQueryDto,
    assignMatkulDto,
} = require('./kurikulum.dto');

router.get('/', auth, validateDto(listKurikulumQueryDto), controller.list);
router.get('/:id', auth, controller.detail);

router.post('/', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(createKurikulumDto), controller.create);
router.patch('/:id', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(updateKurikulumDto), controller.update);
router.delete('/:id', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), controller.remove);

// assign matkul ke kurikulum
router.post('/:id/assignMatkul', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(assignMatkulDto), controller.assignMatkul);

module.exports = router;
