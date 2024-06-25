// frontend/src/scenes/Parents/index.jsx
// /parents

import React, { useState, useEffect } from 'react';
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';


const Parents = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const columnsparent = [
      { field: "ic_number", headerName: "No. Kad Pengenalan", flex: 1 },
      { field: "full_name", headerName: "Nama penuh", flex: 1 },
      { field: "per_phone_number", headerName: "No. Telefon", flex: 1 },

      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleViewParents(params.row.id)}
              sx={{ marginRight: 1 }}
            >
              View
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleUpdateParents(params.row.id)}
              sx={{ marginRight: 1 }}
            >
              Update
            </Button>
            {/* <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDeleteParents(params.row.id)}
            >
              Delete
            </Button> */}
          </Box>
        ),
      },
    ];
  
    // parent Data
  const [Parents, setParents] = useState([]);

    const getParents = async () => {
      try {
          const response = await axios.get('http://127.0.0.1:8000/api/parentprofile/');
          const dataWithIds = response.data.map((item) => ({ ...item, id: item.id }));
          setParents(dataWithIds);
      } catch (error) {
          console.error("Error fetching parent data:", error);
      }
  };
  
  
  const handleViewParents = (parentId) => {
      // Redirect to the view parent page with the ID as a parameter
      window.location.href = `/viewprofileparent/${parentId}`;
  };

  const handleUpdateParents = (parentId) => {
      window.location.href = `/updateparent/${parentId}`;
  }

  const handleDeleteParents = async (parentId) => {
      try {
          // Make an HTTP DELETE request to delete the parent with the given ID
          await axios.delete(`http://127.0.0.1:8000/api/parentprofile/${parentId}`);
          // Optionally, you can update the UI to reflect the deletion by removing the deleted parent from the state or refetching the parent data
          console.log(`parent with ID ${parentId} deleted successfully.`);
          // Refresh the parent data after deletion
          // allert message with show the id
          alert(`parent with ID ${parentId} deleted successfully.`);
          getParents();
      } catch (error) {
          console.error(`Error deleting parent with ID ${parentId}:`, error);
          // Optionally, you can display an error message to the user
          alert(`Error deleting parent with ID ${parentId}. Please try again later.`);
      }
  };

  // end parent data
    
  // Fetch School Session and parent data on component mount
  useEffect(() => {
    getParents();
  }, []);


    return (
      <Box m="10px">
          <Header 
              title="IBU BAPA" 
              subtitle="Senarai ibu bapa di APCPJ" 
          /> 
          <Box m="10px 0 0 0">
            {/* Add New Button start */}
            <Link to="/register-parent">

              <Button
                sx={{
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "10px 15px",
                  marginBottom: "5px",
                }}
              >
                <AddOutlinedIcon sx={{ mr: "10px" }} />
                  Add New
              </Button>
            </Link>
            {/* Add New end */}
          </Box>
          <Box
            m="10px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${colors.grey[100]} !important`,
              },
              
            }}
        >
        <DataGrid 
            rows={Parents} 
            columns={columnsparent}
            getRowId={(row) => row.id}
            slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </Box>
    );
};

export default Parents;