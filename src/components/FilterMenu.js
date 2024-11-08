import React from "react";
import { RefinementList } from "react-instantsearch-dom";

const FilterMenu = () => (
  <div className="bg-white p-4 rounded-md shadow-lg">
    <h3 className="font-semibold">Filtrar por tipo de cocina</h3>
    <RefinementList attribute="food_type" />
  </div>
);

export default FilterMenu;
