const crypto = require('crypto')

function hashPassword(password) {
    // Gera um salt aleatório de 16 bytes e converte para hexadecimal
    const senha_salt = crypto.randomBytes(16).toString('hex')
    // Gera o hash com PBKDF2, 100000 iterações, 64 bytes
    const hashedPassword = crypto.pbkdf2Sync(
        password, 
        senha_salt, 
        100000, 
        64, 
        'sha512'
    ).toString('hex')
    
    return { senha_salt, senha_hash: hashedPassword } 
}

function verifyPassword(password, salt, storedHash) {
    // Recria o hash usando o mesmo salt e as mesmas configurações
    const newHashedPassword = crypto.pbkdf2Sync(
        password, 
        salt, 
        100000, 
        64, 
        'sha512'
    ).toString('hex')
    return newHashedPassword === storedHash
}

module.exports = {    
    hashPassword,
    verifyPassword
}