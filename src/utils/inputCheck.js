
function CHECK_ID(id){
    if( !(CHECK_NOT_NULL(id)) || isNaN(id) || id <= 0){
        return false
    }else{
        return true
    }
}
function CHECK_TINYINT(valor){
    if( !(CHECK_NOT_NULL(valor)) || isNaN(valor)){
        return false
    }else if( valor == 0 || valor == 1){
        return true
    }else{
        return false
    }
}
function CHECK_pontuacao(pontuacao){
    if( !(CHECK_NOT_NULL(pontuacao)) || isNaN(pontuacao) || pontuacao < 0 || pontuacao > 10){
        return false
    }else{
        return true
    }
}

// console.log(!(CHECK_ID("1")));

function verificarNumero(number){
    let numero = Number(number)
    if(numero == undefined || numero == "" || numero == null || isNaN(numero)){
        numero = false
    }
    return numero
}
function CHECK_DECIMAL(value, p, s) {
    if (value === undefined) return false

    const number = parseFloat(value)
    if (isNaN(number)) return false

    const [intPart, decimalPart = ""] = number.toString().split(".")

    // Total de dígitos: inteiros + decimais
    const totalDigits = intPart.replace("-", "").length + decimalPart.length

    // Valida número de casas decimais e total de dígitos
    if (decimalPart.length > s) return false
    if (totalDigits > p) return false

    return true
}
function CHECK_DECIMAL_NOT_NULL(value, p, s) {
    if (value === undefined || value === null || value === "") return false

    const number = parseFloat(value)
    if (isNaN(number)) return false

    const [intPart, decimalPart = ""] = number.toString().split(".")

    // Total de dígitos: inteiros + decimais
    const totalDigits = intPart.replace("-", "").length + decimalPart.length

    // Valida número de casas decimais e total de dígitos
    if (decimalPart.length > s) return false
    if (totalDigits > p) return false

    return true
}



function CHECK_VARCHAR_NOT_NULL(text, letters){
    // console.log(text + " - " + letters)
    if(!(CHECK_NOT_NULL(text)) || !(CHECK_VARCHAR(text, letters))){
        return false
    }else{
        return true
    }
}

function CHECK_NOT_NULL(attribute){
    if(attribute == undefined || attribute == "" || attribute == null){
        return false
    }else{
        return true
    }
}

function CHECK_VARCHAR(text, letters){
    if(text == undefined || text.length > letters){
        return false
    }else{
        return true
    }
}
function CHECK_UNDEFINED(text){
    if(text === undefined){
        return false
    }else{
        return true
    }
}

function CHECK_tbl_comentarios(comentario) {
    if (
        CORRECTION.CHECK_VARCHAR_NOT_NULL(comentario.comentario, 500) &&
        CORRECTION.CHECK_VARCHAR_NOT_NULL(comentario.data_comentario, 24) &&
        CORRECTION.CHECK_ID(comentario.tbl_usuario_id) &&
        CORRECTION.CHECK_ID(comentario.tbl_noticia_id)
    ) {
        return true
    } else {
        return false
    }
}


module.exports = {    
    CHECK_ID,
    verificarNumero,
    CHECK_VARCHAR_NOT_NULL,
    CHECK_VARCHAR,
    CHECK_UNDEFINED,
    CHECK_DECIMAL,
    CHECK_DECIMAL_NOT_NULL,
    CHECK_TINYINT,
    CHECK_tbl_comentarios
}