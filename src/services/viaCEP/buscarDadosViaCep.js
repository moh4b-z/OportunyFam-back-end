async function buscarDadosViaCep(cep){
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    if (!response.ok) throw new Error('Erro ao buscar CEP')

    const data = await response.json()
    if ('erro' in data) return null

    // Remove o campo ddd antes de retornar
    const { ddd, ...rest } = data
    return rest
  } catch (error) {
    console.error('Erro ao buscar dados do ViaCEP:', error)
    return null
  }
}

module.exports = {
    buscarDadosViaCep
}