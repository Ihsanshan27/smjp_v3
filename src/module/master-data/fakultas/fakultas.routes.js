const router = require('express').Router();
const controller = require('./fakultas.controller');
const validateDto = require('../../../middlewares/validateDto');
const { auth, role } = require('../../../middlewares/auth');
const {
    listFakultasQueryDto,
    createFakultasDto,
    updateFakultasDto,
} = require('./fakultas.dto');

// list/detail fakultas bisa diakses semua user yang login
router.get('/', auth, validateDto(listFakultasQueryDto), controller.list);
router.get('/:id', auth, controller.detail);

// create/update/delete cuma ADMIN & TU_FAKULTAS
router.post('/', auth, role(['ADMIN', 'TU_FAKULTAS']), validateDto(createFakultasDto), controller.create);
router.patch('/:id', auth, role(['ADMIN', 'TU_FAKULTAS']), validateDto(updateFakultasDto), controller.update);
router.delete('/:id', auth, role(['ADMIN', 'TU_FAKULTAS']), controller.remove);

module.exports = router;
