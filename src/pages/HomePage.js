import React, { useState, useEffect } from "react";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { algoliaSearchClient, index } from "../services/algolia";
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material"; // Íconos

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    foodType: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalHits, setTotalHits] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [deleteRestaurantID, setDeleteRestaurantID] = useState(null);

  const fetchRestaurants = async () => {
    try {
      const { hits, nbHits } = await index.search(searchTerm, {
        hitsPerPage: rowsPerPage,
        page,
      });
      setRestaurants(hits);
      setTotalHits(nbHits);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const addRestaurant = async () => {
    if (newRestaurant.name && newRestaurant.foodType) {
      try {
        await index.saveObjects([
          {
            objectID: new Date().toISOString(),
            name: newRestaurant.name,
            food_type: newRestaurant.foodType,
          },
        ]);
        setModalMessage("Restaurant added successfully!");

        // Limpiar campos de entrada
        setNewRestaurant({ name: "", foodType: "" });

        fetchRestaurants();
      } catch (error) {
        setModalMessage("Error adding restaurant. Please try again.");
        console.error("Error adding restaurant:", error);
      }
      setOpenModal(true);
    } else {
      setModalMessage("Please fill in all fields.");
      setOpenModal(true);
    }
  };

  const confirmDeleteRestaurant = (id) => {
    setDeleteRestaurantID(id);
    setModalMessage("Are you sure you want to delete this restaurant?");
    setOpenModal(true);
  };

  const deleteRestaurant = async () => {
    try {
      if (deleteRestaurantID) {
        await index.deleteObject(deleteRestaurantID);
        setModalMessage("Restaurant deleted successfully!");

        // Elimina el restaurante del estado local
        setRestaurants((prevRestaurants) =>
          prevRestaurants.filter(
            (restaurant) => restaurant.objectID !== deleteRestaurantID
          )
        );
      }
    } catch (error) {
      setModalMessage("Error deleting restaurant. Please try again.");
      console.error("Error deleting restaurant:", error);
    }
    setOpenModal(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    fetchRestaurants();
  }, [page, searchTerm, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center py-12 px-6 sm:px-8 lg:px-16">
      <div className="max-w-7xl w-full bg-white p-8 rounded-xl shadow-xl space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Restaurant Management
        </h1>

        <TextField
          label="Search Restaurants"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-6"
        />

        <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col sm:flex-row gap-6">
          <input
            type="text"
            placeholder="Restaurant Name"
            value={newRestaurant.name}
            onChange={(e) =>
              setNewRestaurant({ ...newRestaurant, name: e.target.value })
            }
            className="flex-1 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Cuisine Type"
            value={newRestaurant.foodType}
            onChange={(e) =>
              setNewRestaurant({
                ...newRestaurant,
                foodType: e.target.value,
              })
            }
            className="flex-1 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addRestaurant}
            className="bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Add Restaurant
          </button>
        </div>

        <TableContainer component={Paper} className="mb-8">
          <Table sx={{ minWidth: 650 }} aria-label="restaurant table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Cuisine Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurants.map((restaurant) => (
                <TableRow key={restaurant.objectID}>
                  <TableCell>{restaurant.name}</TableCell>
                  <TableCell>{restaurant.food_type}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>
                        confirmDeleteRestaurant(restaurant.objectID)
                      }
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalHits}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      {/* Modal for confirmation or error messages */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontWeight: "bold", fontSize: "20px" }}
        >
          {"Action Status"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ fontSize: "16px" }}
          >
            {modalMessage}
            {modalMessage.includes("successfully") && (
              <CheckCircleIcon color="success" />
            )}
            {modalMessage.includes("Error") && <ErrorIcon color="error" />}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {modalMessage ===
          "Are you sure you want to delete this restaurant?" ? (
            <>
              <Button
                onClick={deleteRestaurant}
                color="error"
                variant="contained"
              >
                Yes, Delete
              </Button>
              <Button
                onClick={handleCloseModal}
                color="primary"
                autoFocus
                variant="outlined"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={handleCloseModal}
              color="primary"
              autoFocus
              variant="contained"
            >
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HomePage;
