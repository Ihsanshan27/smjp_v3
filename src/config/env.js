require('dotenv').config()

const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'ikacdgsukouadsohuadshouads',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '90d'
}

module.exports = config