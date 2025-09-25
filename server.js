const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
app.use(bodyParser.json())

const MainRoutes = require("./src/routes/MainRoutes")
app.use("/v1/oportunyfam", MainRoutes)


const PORT = process.env.PORT || 8080
app.listen(PORT, function(){
  console.log(`Servidor rodando na porta ${PORT}`)
})
