const CORRECTION = require("./inputCheck");

function CHECK_tbl_tipo_nivel(tipoNivel) {
    return (
        CORRECTION.CHECK_VARCHAR_NOT_NULL(tipoNivel.nivel, 100)
    );
}


module.exports = {
    CHECK_tbl_tipo_nivel 
};