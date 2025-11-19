const app = require('./app');
const config = require('./config/env');

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`🚀 SMJP API running at http://localhost:${PORT}`);
});
