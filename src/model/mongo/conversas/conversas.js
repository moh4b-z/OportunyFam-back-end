// const { PrismaClient: MongoClient } = require('./generated/mongo')
// const prismaMongo = new MongoClient()

// async function insertConversa(conversa) {
//     try {
//         const nova = await prismaMongo.conversas.create({
//             data: {
//                 participantes: conversa.participantes, // array de NumberInt
//                 atualizado_em: new Date()
//             }
//         })
//         return nova
//     } catch (error) {
//         console.error("Erro ao inserir conversa:", error)
//         return false
//     }
// }

// async function updateConversa(conversa) {
//     try {
//         const atualizado = await prismaMongo.conversas.update({
//             where: { id: conversa.id }, // id é ObjectId no Mongo
//             data: {
//                 participantes: conversa.participantes,
//                 atualizado_em: new Date()
//             }
//         })
//         return atualizado
//     } catch (error) {
//         console.error("Erro ao atualizar conversa:", error)
//         return false
//     }
// }

// async function deleteConversa(id) {
//     try {
//         await prismaMongo.conversas.delete({ where: { id } })
//         return true
//     } catch (error) {
//         console.error("Erro ao deletar conversa:", error)
//         return false
//     }
// }

// async function selectAllConversas() {
//     try {
//         return await prismaMongo.conversas.findMany({ orderBy: { atualizado_em: 'desc' } })
//     } catch (error) {
//         console.error("Erro ao buscar conversas:", error)
//         return false
//     }
// }

// async function selectByIdConversa(id) {
//     try {
//         return await prismaMongo.conversas.findUnique({ where: { id } })
//     } catch (error) {
//         console.error("Erro ao buscar conversa por ID:", error)
//         return false
//     }
// }

// module.exports = {
//     insertConversa,
//     updateConversa,
//     deleteConversa,
//     selectAllConversas,
//     selectByIdConversa
// }
