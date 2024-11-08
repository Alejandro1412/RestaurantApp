import React, { useState, useEffect, useCallback } from "react";
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
import { index } from "../services/algolia";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalHits, setTotalHits] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [deleteRestaurantID, setDeleteRestaurantID] = useState(null);

  const navigate = useNavigate();

  // Fetch restaurants from Algolia based on search term and pagination
  const fetchRestaurants = useCallback(async () => {
    try {
      const { hits, nbHits } = await index.search(searchTerm, {
        hitsPerPage: rowsPerPage,
        page,
      });
      setRestaurants(hits);
      setTotalHits(nbHits);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setModalMessage("Error fetching data.");
      setOpenModal(true);
    }
  }, [searchTerm, rowsPerPage, page]);

  // Confirm deletion of a restaurant
  const confirmDeleteRestaurant = (id) => {
    setDeleteRestaurantID(id);
    setModalMessage("Are you sure you want to delete this restaurant?");
    setOpenModal(true);
  };

  // Delete a restaurant
  const deleteRestaurant = async () => {
    try {
      if (deleteRestaurantID) {
        await index.deleteObject(deleteRestaurantID);
        setModalMessage("Restaurant deleted successfully!");
        setRestaurants((prev) =>
          prev.filter((r) => r.objectID !== deleteRestaurantID)
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
  }, [fetchRestaurants]);

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

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/add-restaurant")}
        >
          Add New Restaurant
        </Button>

        <TextField
          label="Search Restaurants"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-6"
        />

        <TableContainer component={Paper} className="mb-8">
          <Table sx={{ minWidth: 650 }} aria-label="restaurant table">
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Cuisine Type</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurants
                .filter((restaurant) => {
                  return (
                    restaurant.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    restaurant.food_type
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    (restaurant.city &&
                      restaurant.city
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                    (restaurant.address &&
                      restaurant.address
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                    (restaurant.phone_number &&
                      restaurant.phone_number
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
                  );
                })
                .map((restaurant) => (
                  <TableRow key={restaurant.objectID}>
                    <TableCell>{restaurant.name}</TableCell>
                    <TableCell>{restaurant.food_type}</TableCell>
                    <TableCell>{restaurant.city}</TableCell>
                    <TableCell>{restaurant.address}</TableCell>
                    <TableCell>{restaurant.phone_number}</TableCell>
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

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{"Action Status"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{modalMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
          {modalMessage ===
            "Are you sure you want to delete this restaurant?" && (
            <>
              <Button onClick={deleteRestaurant} color="secondary">
                Yes
              </Button>
              <Button onClick={handleCloseModal} color="primary">
                No
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HomePage;
