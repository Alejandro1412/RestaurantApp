import React from "react";
import {
  InstantSearch,
  SearchBox,
  RefinementList,
} from "react-instantsearch-dom";
import { algoliaSearchClient } from "../services/algolia"; // Importación con nombre

const SearchBar = () => (
  <InstantSearch searchClient={algoliaSearchClient} indexName="restaurants">
    <div className="flex justify-center items-center py-6">
      <SearchBox
        className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none"
        placeholder="Buscar restaurantes..."
      />
      {/* Cambio de 'cuisineType' a 'food_type' para coincidir con el índice */}
      <RefinementList attribute="food_type" />
    </div>
  </InstantSearch>
);

export default SearchBar;
