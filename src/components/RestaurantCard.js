import React from "react";

const RestaurantCard = ({ restaurant, deleteRestaurant }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between">
      <h3 className="font-semibold text-xl">{restaurant.name}</h3>
      <p className="text-gray-600">{restaurant.food_type}</p>{" "}
      {/* Cambiado a food_type */}
      <button
        className="bg-red-500 text-white rounded-md py-2 mt-4"
        onClick={() => deleteRestaurant(restaurant.objectID)}
      >
        Eliminar
      </button>
    </div>
  );
};

export default RestaurantCard;
