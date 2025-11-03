const { PrismaClient} = require('../../../../prisma/generated/mysql')
const {Decimal} = require('../../../../prisma/generated/mysql')
const prismaMySQL = new PrismaClient()


async function insertEndereco(endereco) {
    try {
        const sqlInsert = `
            INSERT INTO tbl_endereco (
                cep, logradouro, numero, complemento, bairro,
                cidade, estado, latitude, longitude
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `

        // Executa o comando INSERT
        const result = await prismaMySQL.$executeRawUnsafe(
            sqlInsert,
            endereco.cep,
            endereco.logradouro,
            endereco.numero,
            endereco.complemento,
            endereco.bairro,
            endereco.cidade,
            endereco.estado,
            new Decimal(endereco.latitude),
            new Decimal(endereco.longitude)
        )

        if (result > 0) {
            // Busca o registro recém-inserido
            const sqlSelect = `
                SELECT * FROM tbl_endereco
                WHERE id = LAST_INSERT_ID()
            `

            const enderecoCriado = await prismaMySQL.$queryRawUnsafe(sqlSelect)

            // $queryRawUnsafe retorna um array de resultados
            if (enderecoCriado && enderecoCriado.length > 0) {
                console.log("Endereço inserido com sucesso.")
                return enderecoCriado[0]
            } else {
                console.warn("Endereço inserido, mas não foi possível recuperar os dados.")
                return null
            }
        } else {
            console.warn("Nenhum endereço inserido.")
            return null
        }
    } catch (error) {
        console.error("Erro ao inserir endereço:", error)
        return null
    }
}


async function updateEndereco(endereco){
    try {
        return await prismaMySQL.tbl_endereco.update({
            where: { id: endereco.id },
            data: {
                cep: endereco.cep,
                logradouro: endereco.logradouro,
                numero: endereco.numero,
                complemento: endereco.complemento,
                bairro: endereco.bairro,
                cidade: endereco.cidade,
                estado: endereco.estado,
                latitude: new Decimal(endereco.latitude),
                longitude: new Decimal(endereco.longitude)
            }
        })
    } catch (error) {
        console.error("Erro ao atualizar endereço:", error)
        return false
    }
}


async function deleteEndereco(id){
    try {
        await prismaMySQL.tbl_endereco.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar endereço:", error)
        return false
    }
}

async function selectAllEnderecos(){
    try {
        return await prismaMySQL.tbl_endereco.findMany({ orderBy: { id: 'desc' } })
    } catch (error) {
        console.error("Erro ao buscar endereços:", error)
        return false
    }
}

async function selectByIdEndereco(id){
    try {
        return await prismaMySQL.tbl_endereco.findUnique({ where: { id: id } })
    } catch (error) {
        console.error("Erro ao buscar endereço por ID:", error)
        return false
    }
}

module.exports = {
    insertEndereco,
    updateEndereco,
    deleteEndereco,
    selectAllEnderecos,
    selectByIdEndereco
}