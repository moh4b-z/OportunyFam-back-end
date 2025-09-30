const axios = require("axios")

const OVERPASS_URL = "https://overpass-api.de/api/interpreter"

async function buscarInstituicoes(lat, lon, tipo = "school", raio = 1000) {
  try {
    const query = `
      [out:json];
      node["amenity"="${tipo}"](around:${raio}, ${lat}, ${lon});
      out;
    `

    const response = await axios.post(OVERPASS_URL, query, {
      headers: { "Content-Type": "text/plain" }
    })

    // Normalizar os dados que vieram
    const locais = response.data.elements.map(item => ({
      id: item.id,
      nome: item.tags?.name || "Não informado",
      tipo: item.tags?.amenity || tipo,
      telefone: item.tags?.phone || null,
      email: item.tags?.email || null,
      site: item.tags?.website || null,
      endereco: {
        rua: item.tags?.["addr:street"] || null,
        numero: item.tags?.["addr:housenumber"] || null,
        bairro: item.tags?.["addr:suburb"] || null,
        cidade: item.tags?.["addr:city"] || null,
        estado: item.tags?.["addr:state"] || null,
        cep: item.tags?.["addr:postcode"] || null
      },
      coordenadas: {
        lat: item.lat,
        lon: item.lon
      }
    }))

    return { status_code: 200, locais }
  } catch (error) {
    console.error("Erro ao buscar locais no OSM:", error)
    return { status_code: 500, message: "Erro ao consultar OpenStreetMap" }
  }
}

module.exports = { buscarInstituicoes }