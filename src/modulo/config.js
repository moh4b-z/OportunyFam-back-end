
const API_BASE_URL = 'http://localhost:8080'


/************************* MENSAGENS DE ERRO *************************/

const ERROR_REQUIRED_FIELDS = {
    status: false,
    status_code: 400,
    messagem: "Campo obrigatorio não colocado, ou ultrapassagem de cariteres"
}
const ERROR_NOT_DELETE = {
    status: false,
    status_code: 400,
    messagem: "Não foi possivel deletar"
}
const ERROR_NOT_FOUND = {
    status: false,
    status_code: 404,
    messagem: "Conteudo não encontrado"
}
const ERROR_CEP_NOT_FOUND = {
    status: false,
    status_code: 404,
    messagem: "Cep não encontrado"
}
const ERROR_NOT_FOUND_FOREIGN_KEY = {
    status: false,
    status_code: 404,
    messagem: "ID da chave estrageira não encontrado"
}
const ERROR_CONTENT_TYPE = {
    status: false,
    status_code: 415,
    messagem: "Não foi possivel processar a requisição, pois, o formato de dados encaminhado não surpotado pelo servidor. Favor encaminhar apenas json."
}
const ERROR_INVALID_CREDENTIALS = {
    status: false,
    status_code: 401,
    messagem: "Cradencias erradas"
}
const ERROR_EMAIL_ALREADY_EXISTS = {
    status: false,
    status_code: 409,
    messagem: "Email já existente"
}

const ERROR_INTERNAL_SERVER_MODEL = {
    status: false,
    status_code: 500,
    messagem: "Não foi possivel processar a requisição, pois ocoreram erros internos na model"
}
const ERROR_INTERNAL_SERVER_CONTROLLER = {
    status: false,
    status_code: 500,
    messagem: "Não foi possivel processar a requisição, pois ocoreram erros internos no controller"
}
const ERROR_INTERNAL_SERVER_SERVICES = {
    status: false,
    status_code: 500,
    messagem: "Não foi possivel processar a requisição, pois ocoreram erros internos no services"
}


/************************* MENSAGENS DE SUCESSO *************************/

const SUCCESS_CEATED_ITEM = {
    status: true,
    status_code: 201,
    messagem: "Inserido no banco"
}

const SUCCESS_DELETE_ITEM = {
    status: true,
    status_code: 200,
    messagem: "Deletado do banco"
}

const SUCCESS_UPDATED_ITEM = {
    status: true,
    status_code: 200,
    messagem: "Item atualizado"
}

const SUCCESS_LOGIN = {
    status: true,
    status_code: 200,
    messagem: "Login realizado com sucesso"
}

const SUCCESS_REQUEST = {
    status: true,
    status_code: 200,
    messagem: "Requisição feita com sucesso"
}

module.exports = {
    API_BASE_URL,

    ERROR_REQUIRED_FIELDS,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_INTERNAL_SERVER_SERVICES,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_CONTENT_TYPE,
    ERROR_NOT_FOUND,
    ERROR_NOT_FOUND_FOREIGN_KEY,
    ERROR_NOT_DELETE,
    ERROR_CEP_NOT_FOUND,
    ERROR_INVALID_CREDENTIALS,
    ERROR_EMAIL_ALREADY_EXISTS,

    SUCCESS_CEATED_ITEM,
    SUCCESS_DELETE_ITEM,
    SUCCESS_UPDATED_ITEM,
    SUCCESS_LOGIN,
    SUCCESS_REQUEST
}