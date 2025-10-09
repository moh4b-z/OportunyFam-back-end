const crypto = require('crypto');

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    // Armazena como "salt:hash"
    return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
    // stored = "salt:hash"
    const [salt, hash] = stored.split(':');
    const newHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return newHash === hash;
}

module.exports = { hashPassword, verifyPassword };
