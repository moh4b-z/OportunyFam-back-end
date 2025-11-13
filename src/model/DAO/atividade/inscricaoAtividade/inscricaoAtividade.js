const { PrismaClient } = require('../../../../../prisma/generated/client')
const prismaMySQL = new PrismaClient()

// --- INSERT / CREATE ---
async function insertInscricaoAtividade(dadosInscricao){
    try {
        // Objeto de dados base para o Prisma
        const dataToCreate = {
            observacao: dadosInscricao.observacao || null,

            // --- RELAÇÕES OBRIGATÓRIAS ---
            // Você deve usar o nome da RELAÇÃO (do schema.prisma), e não o nome da coluna FK
            
            tbl_atividade: { // Assumindo que o nome da relação é 'tbl_atividade'
                connect: { 
                    id: dadosInscricao.id_atividade 
                }
            },
            tbl_crianca: { // Assumindo que o nome da relação é 'tbl_crianca'
                connect: { 
                    id: dadosInscricao.id_crianca 
                }
            }
        };

        // --- RELAÇÃO OPCIONAL ---
        // Só adiciona a conexão do responsável SE ele foi fornecido
        if (dadosInscricao.id_responsavel) {
            dataToCreate.tbl_responsavel = { // Assumindo que o nome da relação é 'tbl_responsavel'
                connect: { 
                    id: dadosInscricao.id_responsavel 
                }
            };
        }

        // O seu objeto 'novaInscricao' antigo não é mais necessário
        return await prismaMySQL.tbl_inscricao_atividade.create({
            data: dataToCreate // Usando o novo objeto 'dataToCreate'
        });

    } catch (error) {
        // Verifica se o erro é um erro conhecido do Prisma (P2002 = Unique Constraint Failed)
        if (error.code === 'P2002') {
            // Opcional: verifica se foi exatamente a constraint que esperamos
            if (error.meta?.target.includes('uk_crianca_atividade')) {
                
                console.warn("AVISO: Tentativa de inscrição duplicada (criança/atividade).");
                
                // Em vez de retornar 'false', retorna um objeto de erro
                // que o seu Service/Controller pode identificar.
                return { 
                    error: 'DUPLICATE_ENTRY'
                };
            }
        }
        
        // Se for qualquer outro erro, loga e retorna 'false'
        console.error("Erro ao inserir inscrição de atividade (não P2002):", error);
        return false;
    }
}

// --- SELECT ALL / READ ALL (Opcional, busca por atividade é mais comum) ---
async function selectAllInscricoes(){
    try {
        // Usando a view vw_alunos_instituicao que já traz os dados relacionados
        return await prismaMySQL.$queryRaw`
            SELECT
                t.id as inscricao_id,
                i.instituicao_id,
                i.instituicao_nome,
                i.atividade_id,
                i.atividade_titulo,
                i.crianca_id,
                i.crianca_nome,
                i.crianca_foto,
                i.status_id,
                i.status_inscricao,
                i.data_inscricao,
                t.observacao,
                t.id_responsavel
            FROM tbl_inscricao_atividade t
            JOIN vw_alunos_instituicao i ON 
                i.crianca_id = t.id_crianca AND
                i.atividade_id = t.id_atividade
            ORDER BY t.criado_em DESC
        `
    } catch (error) {
        console.error("Erro ao buscar todas as inscrições:", error)
        return false
    }
}

// --- SELECT BY ID / READ BY ID ---
async function selectByIdInscricao(id){
    try {
        const result = await prismaMySQL.$queryRaw`
            SELECT
                t.id as inscricao_id,
                i.instituicao_id,
                i.instituicao_nome,
                i.atividade_id,
                i.atividade_titulo,
                i.crianca_id,
                i.crianca_nome,
                i.crianca_foto,
                i.status_id,
                i.status_inscricao,
                i.data_inscricao,
                t.observacao,
                t.id_responsavel,
                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'aula_id', ma.id,
                            'presente', ma.presente,
                            'nota_observacao', ma.nota_observacao,
                            'criado_em', ma.criado_em,
                            'atualizado_em', ma.atualizado_em
                        )
                    ),
                    '[]'
                ) as matriculas
            FROM tbl_inscricao_atividade t
            JOIN vw_alunos_instituicao i ON 
                i.crianca_id = t.id_crianca AND
                i.atividade_id = t.id_atividade
            LEFT JOIN tbl_matricula_aula ma ON ma.id_inscricao_atividade = t.id
            WHERE t.id = ${parseInt(id)}
            GROUP BY t.id
        `
        return result.length > 0 ? result[0] : null
    } catch (error) {
        console.error("Erro ao buscar inscrição por ID:", error)
        return false
    }
}

async function updateInscricao(id, novosDados){
    try {
        // 1. Crie um objeto 'data' vazio
        const dataToUpdate = {};

        // 2. Adicione os campos escalares (campos normais)
        // O 'undefined' é importante: se 'observacao' não existir em 'novosDados',
        // 'dataToUpdate.observacao' será 'undefined' e o Prisma o ignorará.
        dataToUpdate.observacao = novosDados.observacao;

        
        // 3. Adicione as Relações (Chaves Estrangeiras)
        
        // --- Para tbl_status_inscricao ---
        if (novosDados.id_status !== undefined) {
            // (Assumindo que o status NUNCA pode ser nulo)
            dataToUpdate.tbl_status_inscricao = {
                connect: { 
                    id: parseInt(novosDados.id_status) 
                }
            };
        }

        // --- Para tbl_responsavel (Opcional) ---
        if (novosDados.id_responsavel !== undefined) {
            
            if (novosDados.id_responsavel === null) {
                // Se o usuário enviou 'null', ele quer REMOVER o responsável
                dataToUpdate.tbl_responsavel = {
                    disconnect: true
                };

            } else {
                // Se o usuário enviou um ID, ele quer ADICIONAR ou TROCAR o responsável
                dataToUpdate.tbl_responsavel = {
                    connect: { 
                        id: parseInt(novosDados.id_responsavel) 
                    }
                };
            }
        }

        // 4. Execute a atualização com o objeto 'data' construído
        return await prismaMySQL.tbl_inscricao_atividade.update({
            where: { id: parseInt(id) },
            data: dataToUpdate // Use o objeto dinâmico
        });

    } catch (error) {
        console.error("Erro ao atualizar inscrição:", error);
        return false;
    }
}

// --- DELETE / DELETE ---
async function deleteInscricao(id){
    try {
        await prismaMySQL.tbl_inscricao_atividade.delete({ where: { id: parseInt(id) } })
        return true
    } catch (error) {
        console.error("Erro ao deletar inscrição:", error)
        return false
    }
}

module.exports = {
    insertInscricaoAtividade,
    selectAllInscricoes,
    selectByIdInscricao,
    updateInscricao,
    deleteInscricao
}