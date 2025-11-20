const router = require('express').Router();
const { auth, role } = require('../../../middlewares/auth');
const validateDto = require('../../../middlewares/validateDto');
const { createSlotDto, updateSlotDto } = require('./slotWaktu.dto');
const slotWaktuController = require('./slotWaktu.controller');

// Get all slots (semua user)
router.get('/', auth, slotWaktuController.getAllSlots);

// Get slot by ID
router.get('/:id', auth, slotWaktuController.getSlotById);

// Create slot (ADMIN only)
router.post(
    '/',
    auth,
    role(['ADMIN']),
    validateDto(createSlotDto),
    slotWaktuController.createSlot
);

// Update slot (ADMIN only)
router.patch(
    '/:id',
    auth,
    role(['ADMIN']),
    validateDto(updateSlotDto),
    slotWaktuController.updateSlot
);

// Soft delete (ADMIN only)
router.delete(
    '/:id',
    auth,
    role(['ADMIN']),
    slotWaktuController.deleteSlot
);

module.exports = router;