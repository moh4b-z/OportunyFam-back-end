const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const encryptionFunction = require("../../../utils/encryptionFunction")
const criancaDAO = require("../../../model/DAO/crianca/crianca")
const loginDAO = require("../../../model/DAO/login")
const responsavelDAO = require("../../../model/DAO/usuario/responsavel/responsavel")
const usuarioDAO = require("../../../model/DAO/usuario/usuario")

async function inserirCrianca(dadosCrianca, contentType) {
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_crianca(dadosCrianca) && dadosCrianca.id_usuario) {
                // Validar se o usuário (responsável) existe
                const responsavelExiste = await usuarioDAO.selectByIdUsuario(dadosCrianca.id_usuario)
                if (!responsavelExiste) {
                    return MENSAGE.ERROR_NOT_FOUND_FOREIGN_KEY
                }
                const emailExists = await loginDAO.verifyEmailExists(dadosCrianca.email)
                if (emailExists) {
                    return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                }
                const cpfExists = await loginDAO.verifyCPFExists(dadosCrianca.cpf)
                if (cpfExists) {
                    return MENSAGE.ERROR_CPF_ALREADY_EXISTS
                }

                let senha_hash  = encryptionFunction.hashPassword(dadosCrianca.senha)
                dadosCrianca.senha = senha_hash

                let result = await criancaDAO.insertCrianca(dadosCrianca)
                if(result){
                    let resultResponsavel = await responsavelDAO.insertResponsavel({
                        id_usuario: dadosCrianca.id_usuario,
                        id_crianca: result.id
                    })
                    return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, crianca: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
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

async function atualizarCrianca(dadosCrianca, id, contentType) {
    try {
        if (contentType == "application/json") {
            if (CORRECTION.CHECK_ID(id)) {
                let resultSearch = await buscarCrianca(parseInt(id))
                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    const criancaExistente = resultSearch.crianca
                    
                    // Prepara os dados para atualização mantendo valores existentes se não fornecidos
                    const dadosAtualizados = {
                        nome: dadosCrianca.nome || criancaExistente.nome,
                        email: dadosCrianca.email || criancaExistente.email,
                        senha: dadosCrianca.senha ? encryptionFunction.hashPassword(dadosCrianca.senha) : criancaExistente.senha,
                        telefone: 'telefone' in dadosCrianca ? dadosCrianca.telefone : criancaExistente.telefone,
                        foto_perfil: 'foto_perfil' in dadosCrianca ? dadosCrianca.foto_perfil : criancaExistente.foto_perfil,
                        cpf: dadosCrianca.cpf || criancaExistente.cpf,
                        data_nascimento: dadosCrianca.data_nascimento || criancaExistente.data_nascimento,
                        id_sexo: dadosCrianca.id_sexo || criancaExistente.id_sexo,
                        id: parseInt(id)
                    }

                    // Valida apenas se o email for alterado
                    if (dadosCrianca.email && dadosCrianca.email !== criancaExistente.email) {
                        let emailExists = await loginDAO.verifyEmailExists(dadosCrianca.email)
                        if (emailExists) {
                            return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                        }
                    }
                    
                    // Valida apenas se o CPF for alterado
                    if (dadosCrianca.cpf && dadosCrianca.cpf !== criancaExistente.cpf) {
                        const cpfExists = await loginDAO.verifyCPFExists(dadosCrianca.cpf, criancaExistente.pessoa_id)
                        if (cpfExists) {
                            return MENSAGE.ERROR_CPF_ALREADY_EXISTS
                        }
                    }

                    let result = await criancaDAO.updateCrianca(dadosAtualizados)
                    return result ? { ...MENSAGE.SUCCESS_UPDATED_ITEM, crianca: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
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

async function excluirCrianca(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let resultSearch = await buscarCrianca(parseInt(id))
            if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                let result = await criancaDAO.deleteCrianca(parseInt(id))
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

async function listarTodasCriancas() {
    try {
        let result = await criancaDAO.selectAllCriancas()
        if (result) {
            return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, criancas: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarCrianca(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await criancaDAO.selectByIdCrianca(parseInt(id))
            return result ? { ...MENSAGE.SUCCESS_REQUEST, crianca: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}


module.exports = {
    inserirCrianca,
    atualizarCrianca,
    excluirCrianca,
    listarTodasCriancas,
    buscarCrianca
}