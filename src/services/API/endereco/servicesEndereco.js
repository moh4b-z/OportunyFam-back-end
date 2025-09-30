const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const enderecoDAO = require("../../../model/DAO/endereco/endereco")
const viaCepService = require('../../viaCEP/buscarDadosViaCep')

async function inserirEndereco(dadosEndereco, contentType){
    try {
        if (contentType == "application/json") {
            if (dadosEndereco.cep) {
                
                const dadosCep = await viaCepService.buscarDadosViaCep(dadosEndereco.cep)
                
                if (dadosCep) {
                    
                    // Mapeia os dados do ViaCEP para o objeto do banco de dados
                    const novoEndereco = {
                        cep: dadosCep.cep,
                        logradouro: dadosCep.logradouro,
                        bairro: dadosCep.bairro,
                        cidade: dadosCep.localidade,
                        estado: dadosCep.uf,
                        numero: dadosEndereco.numero || null,
                        complemento: dadosEndereco.complemento || null
                    }
                    
                    let result = await enderecoDAO.insertEndereco(novoEndereco)
                    return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, endereco: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                } else {
                    return MENSAGE.ERROR_CEP_NOT_FOUND
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

async function atualizarEndereco(dadosEndereco, id, contentType){
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_endereco(dadosEndereco) && CORRECTION.CHECK_ID(id)) {
                
                let resultSearch = await buscarEndereco(parseInt(id))

                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    
                    let enderecoExistente = resultSearch.endereco // Reutiliza os dados encontrados

                    // 1. Processar novo CEP ou manter o antigo
                    if (dadosEndereco.cep && dadosEndereco.cep !== enderecoExistente.cep) {
                        const dadosCep = await viaCepService.buscarDadosViaCep(dadosEndereco.cep)
                        if (dadosCep) {
                            // Atualiza os campos do endereço com o novo CEP
                            dadosEndereco.logradouro = dadosCep.logradouro
                            dadosEndereco.bairro = dadosCep.bairro
                            dadosEndereco.cidade = dadosCep.localidade
                            dadosEndereco.estado = dadosCep.uf
                        } else {
                            return MENSAGE.ERROR_CEP_NOT_FOUND
                        }
                    } else {
                        // Se o CEP não foi alterado ou não foi enviado, usa o CEP existente e os dados associados
                        dadosEndereco.cep = enderecoExistente.cep
                        dadosEndereco.logradouro = dadosEndereco.logradouro || enderecoExistente.logradouro
                        dadosEndereco.bairro = dadosEndereco.bairro || enderecoExistente.bairro
                        dadosEndereco.cidade = dadosEndereco.cidade || enderecoExistente.cidade
                        dadosEndereco.estado = dadosEndereco.estado || enderecoExistente.estado
                    }

                    // 2. Continua com a atualização
                    dadosEndereco.id = parseInt(id)
                    let result = await enderecoDAO.updateEndereco(dadosEndereco)
                    
                    return result ? MENSAGE.SUCCESS_UPDATED_ITEM : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
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