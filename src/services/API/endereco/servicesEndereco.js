const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const enderecoDAO = require("../../../model/DAO/endereco/endereco")
// const viaCepService = require('../../viaCEP/buscarDadosViaCep')

async function inserirEndereco(dadosEndereco, contentType){
    try {
        if (contentType == "application/json") {
            // A validação espera que o Front-end envie o endereço completo (cep, logradouro, bairro, cidade, estado)
            if (TableCORRECTION.CHECK_tbl_endereco(dadosEndereco) && dadosEndereco.cep && dadosEndereco.logradouro && dadosEndereco.cidade && dadosEndereco.estado) {
                
                const novoEndereco = {
                    cep: dadosEndereco.cep,
                    logradouro: dadosEndereco.logradouro,
                    bairro: dadosEndereco.bairro || null,
                    cidade: dadosEndereco.cidade,
                    estado: dadosEndereco.estado,
                    numero: dadosEndereco.numero || null,
                    complemento: dadosEndereco.complemento || null
                }
                
                let result = await enderecoDAO.insertEndereco(novoEndereco)
                return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, endereco: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                
            } else {
                return MENSAGE.ERROR_REQUIRED_FIELDS 
            }
        } else {
            return MENSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error(error)
        // Se ocorrer um erro no DAO, provavelmente é falha de conexão ou dados
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES 
    }
}

async function atualizarEndereco(dadosEndereco, id, contentType){
    try {
        if (contentType == "application/json") {
            // A validação é mais flexível no UPDATE, permitindo a atualização parcial, mas deve ter ID
            if (CORRECTION.CHECK_ID(id)) {
                
                let resultSearch = await buscarEndereco(parseInt(id))

                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    
                    let enderecoExistente = resultSearch.endereco 
                    
                    // 1. Prepara o objeto de atualização, priorizando os dados do request ou mantendo os existentes
                    const enderecoAtualizado = {
                        id: parseInt(id),
                        cep: dadosEndereco.cep || enderecoExistente.cep,
                        logradouro: dadosEndereco.logradouro || enderecoExistente.logradouro,
                        numero: dadosEndereco.numero || enderecoExistente.numero,
                        complemento: dadosEndereco.complemento || enderecoExistente.complemento,
                        bairro: dadosEndereco.bairro || enderecoExistente.bairro,
                        cidade: dadosEndereco.cidade || enderecoExistente.cidade,
                        estado: dadosEndereco.estado || enderecoExistente.estado
                    }
                    
                    // 2. Garante a checagem final da estrutura dos dados combinados
                    // Se algum campo básico for alterado, o Front-end deve ter enviado o seu novo valor.
                    if (TableCORRECTION.CHECK_tbl_endereco(enderecoAtualizado)) {
                        let result = await enderecoDAO.updateEndereco(enderecoAtualizado)
                        return result ? MENSAGE.SUCCESS_UPDATED_ITEM : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                    } else {
                        return MENSAGE.ERROR_REQUIRED_FIELDS // Retorna erro se a validação falhar
                    }

                } else if (resultSearch.status_code == MENSAGE.ERROR_NOT_FOUND.status_code) {
                    return MENSAGE.ERROR_NOT_FOUND
                } else {
                    return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
                }
            } else {
                return MENSAGE.ERROR_REQUIRED_FIELDS
            }
        } else {
            return MENSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function excluirEndereco(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let resultSearch = await buscarEndereco(parseInt(id))
            
            if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                let result = await enderecoDAO.deleteEndereco(parseInt(id))
                return result ? MENSAGE.SUCCESS_DELETE_ITEM : MENSAGE.ERROR_NOT_DELETE
            } else if (resultSearch.status_code == MENSAGE.ERROR_NOT_FOUND.status_code) {
                return MENSAGE.ERROR_NOT_FOUND
            } else {
                return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
            }
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function listarTodosEnderecos(){
    try {
        let result = await enderecoDAO.selectAllEnderecos()
        if (result) {
            return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, enderecos: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarEndereco(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await enderecoDAO.selectByIdEndereco(parseInt(id))
            return result ? { ...MENSAGE.SUCCESS_REQUEST, endereco: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

module.exports = {
    inserirEndereco,
    atualizarEndereco,
    excluirEndereco,
    listarTodosEnderecos,
    buscarEndereco
}