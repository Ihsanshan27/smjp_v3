const router = require('express').Router();
const prisma = require('../../../config/prisma');
const { auth } = require('../../../middlewares/auth');

router.get('/', auth, async (req, res, next) => {
    try {
        const items = await prisma.hari.findMany({
            where: { deletedAt: null },
            orderBy: { urutan: 'asc' },
        });
        res.json({ status: 'success', data: items });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
