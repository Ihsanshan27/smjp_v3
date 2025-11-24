const router = require('express').Router();
const controller = require('./preferensiDosen.controller');
const validateDto = require('../../../middlewares/validateDto');
const { auth, role } = require('../../../middlewares/auth');
const {
    listPreferensiQueryDto,
    createPreferensiDto,
    updatePreferensiDto,
} = require('./preferensiDosen.dto');

// LIST & DETAIL → semua user login
router.get('/', auth, validateDto(listPreferensiQueryDto), controller.list);
router.get('/:id', auth, controller.detail);

// CREATE → ADMIN, TU, DOSEN
router.post('/', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI', 'DOSEN']), validateDto(createPreferensiDto), controller.create);
// UPDATE → ADMIN, TU, DOSEN
router.patch('/:id', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI', 'DOSEN']), validateDto(updatePreferensiDto), controller.update);
// DELETE → ADMIN, TU, DOSEN
router.delete('/:id', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI', 'DOSEN']), controller.remove);

module.exports = router;
