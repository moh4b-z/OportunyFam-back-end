const servicesLogin = require("../services/API/servicesLogin")

const postLoginUniversal = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesLogin.loginUniversal(dadosBody, contentType)
    // console.log(result);
    
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postLoginUniversal
}