const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', require('./module/auth/auth.routes'));
app.use('/api/pengguna', require('./module/pengguna/pengguna.routes'));
app.use('/api/master-data/fakultas', require('./module/master-data/fakultas/fakultas.routes'));
app.use('/api/master-data/prodi', require('./module/master-data/prodi/prodi.routes'));
app.use('/api/master-data/periode-akademik', require('./module/master-data/periode-akademik/periodeAkademik.routes'));
app.use('/api/master-data/hari', require('./module/master-data/hari/hari.routes'));
app.use('/api/master-data/slot-waktu', require('./module/master-data/slot-waktu/slotWaktu.routes'));
app.use('/api/master-data/ruang', require('./module/master-data/ruang/ruang.routes'));
app.use('/api/master-data/dosen', require('./module/master-data/dosen/dosen.routes'));
app.use('/api/master-data/kelompok-kelas', require('./module/master-data/kelompok-kelas/kelompokKelas.routes'));
app.use('/api/kurikulum/mata-kuliah', require('./module/kurikulum/mata-kuliah/mataKuliah.routes'));
app.use('/api/kurikulum/kurikulum', require('./module/kurikulum/kurikulum/kurikulum.routes'));
app.use('/api/kurikulum/program-matkul', require('./module/kurikulum/program-matkul/programMatkul.routes'));
app.use('/api/pengajaran/penugasan-mengajar', require('./module/pengajaran/penugasan-mengajar/penugasanMengajar.routes'));
app.use('/api/pengajaran/preferensi-dosen', require('./module/pengajaran/preferensi-dosen/preferensiDosen.routes'));
app.use('/api/scheduler', require('./module/scheduler/scheduler.routes'));

app.use(errorHandler);

module.exports = app;
