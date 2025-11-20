const slotWaktuRepository = require('./slotWaktu.repository');
const AppError = require('../../../utils/appError');

class SlotWaktuService {
    // Helper function
    timeStrToDate(str) {
        return new Date(`1970-01-01T${str}:00.000Z`);
    }

    calculateDuration(jamMulai, jamSelesai) {
        return Math.round((jamSelesai - jamMulai) / (1000 * 60));
    }

    async getAllSlots() {
        return await slotWaktuRepository.findAll();
    }

    async createSlot(slotData) {
        const { nama, jamMulai: jamMulaiStr, jamSelesai: jamSelesaiStr } = slotData;

        // Convert time strings to Date objects
        const jamMulai = this.timeStrToDate(jamMulaiStr);
        const jamSelesai = this.timeStrToDate(jamSelesaiStr);

        // Validate time order
        if (jamSelesai <= jamMulai) {
            throw new AppError('Jam selesai harus setelah jam mulai.', 400, 'INVALID_TIME_RANGE');
        }

        // Check for existing slot with same time
        const existingSlot = await slotWaktuRepository.checkExists(jamMulai, jamSelesai);
        if (existingSlot) {
            throw new AppError('Slot waktu dengan jam yang sama sudah ada.', 409, 'SLOT_ALREADY_EXISTS');
        }

        // Calculate duration
        const durasiMenit = this.calculateDuration(jamMulai, jamSelesai);

        const data = {
            nama,
            jamMulai,
            jamSelesai,
            durasiMenit,
        };

        return await slotWaktuRepository.create(data);
    }

    async updateSlot(id, updateData) {
        const existingSlot = await slotWaktuRepository.findById(id);
        if (!existingSlot || existingSlot.deletedAt) {
            throw new AppError('Slot waktu tidak ditemukan.', 404, 'SLOT_NOT_FOUND');
        }

        let jamMulai = existingSlot.jamMulai;
        let jamSelesai = existingSlot.jamSelesai;

        // Update time if provided
        if (updateData.jamMulai) {
            jamMulai = this.timeStrToDate(updateData.jamMulai);
        }
        if (updateData.jamSelesai) {
            jamSelesai = this.timeStrToDate(updateData.jamSelesai);
        }

        // Validate time order
        if (jamSelesai <= jamMulai) {
            throw new AppError('Jam selesai harus setelah jam mulai.', 400, 'INVALID_TIME_RANGE');
        }

        // Check for existing slot with same time (excluding current slot)
        const existingSlotWithSameTime = await slotWaktuRepository.checkExists(jamMulai, jamSelesai, id);
        if (existingSlotWithSameTime) {
            throw new AppError('Slot waktu dengan jam yang sama sudah ada.', 409, 'SLOT_ALREADY_EXISTS');
        }

        // Calculate duration
        const durasiMenit = this.calculateDuration(jamMulai, jamSelesai);

        const data = {
            ...(updateData.nama && { nama: updateData.nama }),
            jamMulai,
            jamSelesai,
            durasiMenit,
        };

        return await slotWaktuRepository.update(id, data);
    }

    async deleteSlot(id) {
        const existingSlot = await slotWaktuRepository.findById(id);
        if (!existingSlot || existingSlot.deletedAt) {
            throw new AppError('Slot waktu tidak ditemukan.', 404, 'SLOT_NOT_FOUND');
        }

        const deleted = await slotWaktuRepository.softDelete(id);
        return deleted;
    }

    async getSlotById(id) {
        const slot = await slotWaktuRepository.findById(id);
        if (!slot || slot.deletedAt) {
            throw new AppError('Slot waktu tidak ditemukan.', 404, 'SLOT_NOT_FOUND');
        }
        return slot;
    }
}

module.exports = new SlotWaktuService();