const axios = require("axios");

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

async function buscarCoordenadas(endereco) {
  try {
    // Construir query: exemplo "Rua Exemplo, Cidade, Estado, Brasil"
    const query = `${endereco.logradouro || ""}, ${endereco.bairro || ""}, ${endereco.cidade || ""}, ${endereco.estado || ""}, Brasil`;

    const response = await axios.get(NOMINATIM_URL, {
      params: {
        q: query,
        format: "json",
        addressdetails: 1,
        limit: 1
      },
      headers: {
        "User-Agent": "MeuApp/1.0 (meuemail@exemplo.com)"
      }
    });

    if (response.data.length > 0) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon)
      };
    } else {
      return { latitude: null, longitude: null };
    }
  } catch (error) {
    console.error("Erro ao buscar coordenadas no OSM:", error);
    return { latitude: null, longitude: null };
  }
}

module.exports = { buscarCoordenadas };
