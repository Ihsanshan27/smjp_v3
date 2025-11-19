const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config/env');

function signToken(payload) {
    return jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    });
}

async function hashPassword(rawPassword) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(rawPassword, salt);
}

async function comparePassword(rawPassword, hash) {
    return bcrypt.compare(rawPassword, hash);
}

module.exports = {
    signToken,
    hashPassword,
    comparePassword,
};
