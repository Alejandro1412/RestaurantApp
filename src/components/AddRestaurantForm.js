import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { index } from "../services/algolia";
import { useNavigate } from "react-router-dom";
import "../styles/AddRestaurantForm.css"; // Importa el archivo CSS

const AddRestaurantForm = () => {
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState({
    name: "",
    city: "",
    address: "",
    food_type: "",
    area: "",
    country: "",
    image_url: "",
    mobile_reserve_url: "",
    payment_options: "",
    phone: "",
    postal_code: "",
    price: "",
    reserve_url: "",
    state: "",
    stars_count: "",
    reviews_count: "",
    neighborhood: "",
    phone_number: "",
    price_range: "",
    dining_style: "",
    rounded_stars_count: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errors, setErrors] = useState({}); // State para errores

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRestaurant((prevRestaurant) => ({
      ...prevRestaurant,
      [name]: value,
    }));
  };

  // Validar los campos requeridos
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["name", "city", "food_type", "address", "phone"];

    requiredFields.forEach((field) => {
      if (!restaurant[field]) {
        newErrors[field] = `${field.replace(/_/g, " ")} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setModalSuccess(false);
      setModalMessage("Please fill in all required fields.");
      setOpenModal(true);
      return;
    }

    try {
      // Guardar restaurante sin el objectID, Algolia lo asignará automáticamente
      await index.saveObjects([restaurant], {
        autoGenerateObjectIDIfNotExist: true,
      });
      setModalSuccess(true); // Operación exitosa
      setModalMessage("Restaurant added successfully!");
    } catch (error) {
      setModalSuccess(false); // Hubo un error
      setModalMessage("Error adding restaurant. Please try again.");
      console.error("Error adding restaurant:", error);
    }
    setOpenModal(true); // Abrir el modal
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    if (modalSuccess) {
      navigate("/"); // Redirigir a la página principal si fue exitoso
    }
  };

  return (
    <Paper className="form-container">
      <Typography
        variant="h4"
        align="center"
        className="text-4xl font-bold text-center text-gray-800"
        gutterBottom
      >
        <div className="max-w-7xl w-full bg-white p-8 rounded-xl space-y-8">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Add New Restaurant
          </h1>
        </div>
      </Typography>
      <Grid container spacing={3}>
        {Object.keys(restaurant).map(
          (field, index) =>
            field !== "_geoloc" && (
              <Grid item xs={12} sm={4} key={index}>
                <TextField
                  label={field.replace(/_/g, " ")}
                  name={field}
                  fullWidth
                  value={restaurant[field]}
                  onChange={handleChange}
                  variant="outlined"
                  className="input-field"
                  error={!!errors[field]} // Mostrar error si existe
                  helperText={errors[field]} // Mostrar mensaje de error
                />
              </Grid>
            )
        )}
      </Grid>
      <div className="button-container">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          className="save-button"
        >
          Save Restaurant
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/")}
          className="back-button"
        >
          Back to Home
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{modalSuccess ? "Success" : "Error"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            {modalSuccess ? "Go to Home" : "Try Again"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AddRestaurantForm;
