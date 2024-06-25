// File Path : frontend/src/scenes/students/index.jsx
// Route Path : /students

import React, { useState, useEffect } from 'react';
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';


const Students = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const columnsstudent = [
      { field: "ic_number", headerName: "No. Kad Pengenalan", flex: 1 },
      { field: "full_name", headerName: "Nama Penuh", flex: 1 },
      { field: "gender", headerName: "Jantina", flex: 1 },

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
              onClick={() => handleViewStudents(params.row.id)}
              sx={{ marginRight: 1 }}
            >
              View
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleUpdateStudents(params.row.id)}
              sx={{ marginRight: 1 }}
            >
              Update
            </Button>
            {/* <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDeleteStudents(params.row.id)}
            >
              Delete
            </Button> */}
          </Box>
        ),
      },
    ];
  
    // student Data
  const [Students, setStudents] = useState([]);

    const getStudents = async () => {
      try {
          const response = await axios.get('http://127.0.0.1:8000/api/studentprofile/');
          const dataWithIds = response.data.map((item) => ({ ...item, id: item.id }));
          setStudents(dataWithIds);
      } catch (error) {
          console.error("Error fetching student data:", error);
      }
  };
  
  
  const handleViewStudents = (studentId) => {
      // Redirect to the view student page with the ID as a parameter
      window.location.href = `/viewprofilestudent/${studentId}`;
  };

  const handleUpdateStudents = (studentId) => {
      window.location.href = `/updatestudent/${studentId}`;
  }

  const handleDeleteStudents = async (studentId) => {
      try {
          // Make an HTTP DELETE request to delete the student with the given ID
          await axios.delete(`http://127.0.0.1:8000/api/studentprofile/${studentId}`);
          // Optionally, you can update the UI to reflect the deletion by removing the deleted student from the state or refetching the student data
          console.log(`student with ID ${studentId} deleted successfully.`);
          // Refresh the student data after deletion
          // allert message with show the id
          alert(`student with ID ${studentId} deleted successfully.`);
          getStudents();
      } catch (error) {
          console.error(`Error deleting student with ID ${studentId}:`, error);
          // Optionally, you can display an error message to the user
          alert(`Error deleting student with ID ${studentId}. Please try again later.`);
      }
  };

  // end student data
    
  // Fetch School Session and student data on component mount
  useEffect(() => {
    getStudents();
  }, []);


    return (
      <Box m="10px">
          <Header 
              title="PELAJAR" 
              subtitle="Senarai pelajar di APCPJ" 
          /> 
          <Box m="10px 0 0 0">
            {/* Add New Button start */}
            <Link to="/createstudentprofile">

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
            rows={Students} 
            columns={columnsstudent}
            getRowId={(row) => row.id}
            slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </Box>
    );
};

export default Students;