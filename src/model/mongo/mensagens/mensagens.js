// const { PrismaClient } = require('@prisma/client')
// const prisma = new PrismaClient()

// // Inserir mensagem
// async function insertMensagem(mensagem) {
//     try {
//         const nova = await prisma.mensagens.create({
//             data: {
//                 conversa_id: mensagem.conversa_id,
//                 remetente_id: mensagem.remetente_id,
//                 conteudo: mensagem.conteudo,
//                 lida: mensagem.lida || false,
//                 criada_em: new Date()
//             }
//         })
//         return nova
//     } catch (error) {
//         console.error("Erro ao inserir mensagem:", error)
//         return false
//     }
// }

// // Atualizar mensagem
// async function updateMensagem(mensagem) {
//     try {
//         const atualizado = await prisma.mensagens.update({
//             where: { id: mensagem.id },
//             data: {
//                 conteudo: mensagem.conteudo,
//                 lida: mensagem.lida
//             }
//         })
//         return atualizado
//     } catch (error) {
//         console.error("Erro ao atualizar mensagem:", error)
//         return false
//     }
// }

// // Deletar mensagem
// async function deleteMensagem(id) {
//     try {
//         await prisma.mensagens.delete({ where: { id } })
//         return true
//     } catch (error) {
//         console.error("Erro ao deletar mensagem:", error)
//         return false
//     }
// }

// // Buscar todas as mensagens
// async function selectAllMensagens() {
//     try {
//         return await prisma.mensagens.findMany({ orderBy: { criada_em: 'desc' } })
//     } catch (error) {
//         console.error("Erro ao buscar mensagens:", error)
//         return false
//     }
// }

// // Buscar mensagens por conversa
// async function selectByConversaId(conversaId) {
//     try {
//         return await prisma.mensagens.findMany({
//             where: { conversa_id: conversaId },
//             orderBy: { criada_em: 'asc' }
//         })
//     } catch (error) {
//         console.error("Erro ao buscar mensagens por conversa:", error)
//         return false
//     }
// }

// module.exports = {
//     insertMensagem,
//     updateMensagem,
//     deleteMensagem,
//     selectAllMensagens,
//     selectByConversaId
// }
