const CORRECTION = require("./inputCheck");

function CHECK_tbl_usuario(usuario) {
    return (
        CORRECTION.CHECK_VARCHAR_NOT_NULL(usuario.nome, 50)
    )
}


module.exports = {
    CHECK_tbl_usuario
};