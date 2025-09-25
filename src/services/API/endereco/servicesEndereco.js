const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const enderecoDAO = require("../../../model/DAO/endereco/endereco")
const viaCepService = require('../../viaCEP/buscarDadosViaCep')

const inserirEndereco = async (dadosEndereco, contentType) => {
    try {
        if (contentType === "application/json") {
            if (!dadosEndereco.cep) {
                return MENSAGE.ERROR_REQUIRED_FIELDS
            }

            const dadosCep = await viaCepService.buscarDadosViaCep(dadosEndereco.cep)
            if (!dadosCep) {
                return MENSAGE.ERROR_CEP_NOT_FOUND
            }

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
            return MENSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

const atualizarEndereco = async (dadosEndereco, id, contentType) => {
    try {
        if (contentType === "application/json") {
            if (!id || !TableCORRECTION.CHECK_tbl_endereco(dadosEndereco)) {
                return MENSAGE.ERROR_REQUIRED_FIELDS
            }

            let enderecoExistente = await enderecoDAO.selectByIdEndereco(parseInt(id))
            if (!enderecoExistente) {
                return MENSAGE.ERROR_NOT_FOUND
            }

            if (dadosEndereco.cep) {
                const dadosCep = await viaCepService.buscarDadosViaCep(dadosEndereco.cep)
                if (!dadosCep) {
                    return MENSAGE.ERROR_CEP_NOT_FOUND
                }
                dadosEndereco.logradouro = dadosCep.logradouro
                dadosEndereco.bairro = dadosCep.bairro
                dadosEndereco.cidade = dadosCep.localidade
                dadosEndereco.estado = dadosCep.uf
            } else {
                dadosEndereco.cep = enderecoExistente.cep
                dadosEndereco.logradouro = enderecoExistente.logradouro
                dadosEndereco.bairro = enderecoExistente.bairro
                dadosEndereco.cidade = enderecoExistente.cidade
                dadosEndereco.estado = enderecoExistente.estado
            }

            dadosEndereco.id = parseInt(id)
            let result = await enderecoDAO.updateEndereco(dadosEndereco)

            return result ? MENSAGE.SUCCESS_UPDATED_ITEM : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        } else {
            return MENSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

const excluirEndereco = async (id) => {
    try {
        if (!id || !CORRECTION.CHECK_ID(id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        let enderecoExistente = await enderecoDAO.selectByIdEndereco(parseInt(id))
        if (!enderecoExistente) {
            return MENSAGE.ERROR_NOT_FOUND
        }

        let result = await enderecoDAO.deleteEndereco(parseInt(id))
        return result ? MENSAGE.SUCCESS_DELETE_ITEM : MENSAGE.ERROR_NOT_DELETE
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

const listarTodosEnderecos = async () => {
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

const buscarEndereco = async (id) => {
    try {
        if (!id || !CORRECTION.CHECK_ID(id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        let result = await enderecoDAO.selectByIdEndereco(parseInt(id))
        return result ? { ...MENSAGE.SUCCESS_REQUEST, endereco: result } : MENSAGE.ERROR_NOT_FOUND
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