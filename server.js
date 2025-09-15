const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
app.use(bodyParser.json())

const clientesRoutes = require("./src/routes/routesClientes")
app.use("/v1/clientes", clientesRoutes)


const PORT = process.env.PORT || 8080
app.listen(PORT, function(){
  console.log(`Servidor rodando na porta ${PORT}`)
})