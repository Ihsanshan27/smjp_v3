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

app.use(errorHandler);

module.exports = app;
