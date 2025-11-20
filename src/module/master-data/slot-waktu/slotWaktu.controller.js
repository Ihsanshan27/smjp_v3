const slotWaktuService = require('./slotWaktu.service');
const { success } = require('../../../utils/response');

class SlotWaktuController {
    async getAllSlots(req, res, next) {
        try {
            const slots = await slotWaktuService.getAllSlots();

            return success(res, slots, 'Daftar slot waktu.');
        } catch (error) {
            next(error);
        }
    }

    async createSlot(req, res, next) {
        try {
            const { body } = req.validated;
            const data = await slotWaktuService.createSlot(body);

            return success(res, data, 'Slot waktu berhasil dibuat.', 201);
        } catch (error) {
            next(error);
        }
    }

    async updateSlot(req, res, next) {
        try {
            const { params, body } = req.validated;
            const data = await slotWaktuService.updateSlot(params.id, body);

            return success(res, data, 'Slot waktu berhasil diperbarui.');
        } catch (error) {
            next(error);
        }
    }

    async deleteSlot(req, res, next) {
        try {
            const { id } = req.params;
            const result = await slotWaktuService.deleteSlot(id);

            return success(res, result, 'Slot waktu berhasil dihapus.');
        } catch (error) {
            next(error);
        }
    }

    async getSlotById(req, res, next) {
        try {
            const { id } = req.params;
            const data = await slotWaktuService.getSlotById(id);

            return success(res, data, 'Detail slot waktu.');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SlotWaktuController();