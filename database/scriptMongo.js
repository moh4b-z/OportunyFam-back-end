// Criar banco

// use oportunyfam_mongo

// Coleção: conversas

db.createCollection("conversas")

db.conversas.insertOne({
  participantes: [NumberInt(1), NumberInt(2)], 
  atualizado_em: ISODate()
})


// Coleção: mensagens

db.createCollection("mensagens")

db.mensagens.insertOne({
  conversa_id: ObjectId("64f9aabbccddeeff00112233"), // ID de uma conversa
  remetente_id: NumberInt(1),
  conteudo: "Olá, tudo bem?",
  lida: false,
  criada_em: ISODate()
})

// Coleção: notificacoes

db.createCollection("notificacoes")

db.notificacoes.insertOne({
  usuario_id: NumberInt(2), // destino da notificação (id MySQL)
  mensagem: "Você recebeu uma nova mensagem",
  lida: false,
  criada_em: ISODate()
})
