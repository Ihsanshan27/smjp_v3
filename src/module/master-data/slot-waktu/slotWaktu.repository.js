const prisma = require('../../../config/prisma');

class SlotWaktuRepository {
    async findAll() {
        return await prisma.slotWaktu.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id) {
        return await prisma.slotWaktu.findUnique({
            where: { id },
        });
    }

    async create(data) {
        return await prisma.slotWaktu.create({
            data,
        });
    }

    async update(id, data) {
        return await prisma.slotWaktu.update({
            where: { id },
            data,
        });
    }

    async softDelete(id) {
        return await prisma.slotWaktu.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async checkExists(jamMulai, jamSelesai, excludeId = null) {
        const where = {
            jamMulai,
            jamSelesai,
            deletedAt: null,
        };

        if (excludeId) {
            where.id = { not: excludeId };
        }

        return await prisma.slotWaktu.findFirst({
            where,
        });
    }
}

module.exports = new SlotWaktuRepository();