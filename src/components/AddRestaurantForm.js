import { useState } from "react";
import { index } from "../algolia";

const AddRestaurantForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisineType, setCuisineType] = useState("");

  const handleAddRestaurant = async () => {
    const newRestaurant = {
      name,
      description,
      cuisineType,
    };

    try {
      await index.saveObject(newRestaurant); // Guardar en Algolia
      setName("");
      setDescription("");
      setCuisineType("");
    } catch (error) {
      console.error("Error al agregar restaurante:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold">Agregar Restaurante</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del Restaurante"
        className="w-full p-2 mb-3 border rounded"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
        className="w-full p-2 mb-3 border rounded"
      />
      <input
        type="text"
        value={cuisineType}
        onChange={(e) => setCuisineType(e.target.value)}
        placeholder="Tipo de cocina"
        className="w-full p-2 mb-3 border rounded"
      />
      <button
        onClick={handleAddRestaurant}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Agregar Restaurante
      </button>
    </div>
  );
};

export default AddRestaurantForm;
