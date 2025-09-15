
function CHECK_ID(id){
    if(isNaN(id) || id <= 0){
        return false
    }else{
        return true
    }
}
function CHECK_idade(idade){
    if(isNaN(idade) || idade <= 0){
        return false
    }else{
        return true
    }
}

function CHECK_VARCHAR_NOT_NULL(text, letters){
    // console.log(text + " - " + letters)
    if(CHECK_NOT_NULL(text) && CHECK_VARCHAR(text, letters)){
        return true
    }else{
        return false
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

module.exports = {    
    CHECK_ID,
    CHECK_VARCHAR_NOT_NULL,
    CHECK_VARCHAR,
    CHECK_NOT_NULL,
    CHECK_idade
}