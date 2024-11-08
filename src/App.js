import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddRestaurantForm from "./components/AddRestaurantForm"; // Importa la nueva página
import "./App.css";

const App = () => (
  <Router>
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-restaurant" element={<AddRestaurantForm />} />
      </Routes>
    </div>
  </Router>
);

export default App;
