import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { index } from "../services/algolia";

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [foodTypeFilter, setFoodTypeFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalHits, setTotalHits] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [deleteRestaurantID, setDeleteRestaurantID] = useState(null);

  const navigate = useNavigate();

  // Fetch restaurants based on filters and pagination
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

  // Confirm deletion
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

  const handleFoodTypeChange = (event) => {
    setFoodTypeFilter(event.target.value);
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

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearchTerm = [
      restaurant.name,
      restaurant.food_type,
      restaurant.city,
      restaurant.address,
      restaurant.phone_number,
    ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFoodType = foodTypeFilter
      ? restaurant.food_type
          ?.toLowerCase()
          .includes(foodTypeFilter.toLowerCase())
      : true;
    return matchesSearchTerm && matchesFoodType;
  });

  const columns = [
    { field: "name", headerName: "Restaurant", width: 180 },
    { field: "food_type", headerName: "Cuisine Type", width: 180 },
    { field: "city", headerName: "City", width: 180 },
    { field: "address", headerName: "Address", width: 250 },
    { field: "phone_number", headerName: "Phone", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => confirmDeleteRestaurant(params.row.objectID)}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      ),
    },
  ];

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

        <TextField
          label="Filter by Food Type"
          variant="outlined"
          fullWidth
          value={foodTypeFilter}
          onChange={handleFoodTypeChange}
          className="mb-6"
        />

        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={filteredRestaurants}
            columns={columns}
            pageSize={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            pagination
            page={page}
            onPageChange={handleChangePage}
            onPageSizeChange={handleChangeRowsPerPage}
            rowCount={totalHits}
            paginationMode="server"
            getRowId={(row) => row.objectID} // Use objectID as row ID
          />
        </div>
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
