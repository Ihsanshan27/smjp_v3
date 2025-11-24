const router = require('express').Router();
const controller = require('./viewJadwal.controller');
const validateDto = require('../../middlewares/validateDto');
const { auth } = require('../../middlewares/auth');
const {
    viewJadwalDosenQueryDto,
    viewJadwalKelasQueryDto,
    viewJadwalRuangQueryDto,
    viewJadwalProdiQueryDto,
} = require('./viewJadwal.dto');

// jadwal dosen
router.get('/dosen', auth, validateDto(viewJadwalDosenQueryDto), controller.jadwalDosen);

// jadwal kelas
router.get('/kelas', auth, validateDto(viewJadwalKelasQueryDto), controller.jadwalKelas);

// jadwal ruang
router.get('/ruang', auth, validateDto(viewJadwalRuangQueryDto), controller.jadwalRuang);

// jadwal prodi
router.get('/prodi', auth, validateDto(viewJadwalProdiQueryDto), controller.jadwalProdi);

module.exports = router;
