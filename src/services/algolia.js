// src/services/algolia.js
import algoliasearch from "algoliasearch";

// Configuración de cliente
const client = algoliasearch("VH6I691OVQ", "41988e6be0ec82d3c38be81925d17da4");

// Inicialización del índice
const index = client.initIndex("restaurants");

// Exportación nombrada
export { client as algoliaSearchClient, index };
