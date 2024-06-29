// frontend/src/scenes/teachers/index.jsx

import React, { useState, useEffect } from 'react';
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';


const Teachers = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    const columnsTeacher = [
      { field: "ic_number", headerName: "No. Kad Pengenalan", flex: 1 },
      { field: "full_name", headerName: "Nama Penuh", flex: 1 },
      { field: "phone_number", headerName: "No. Telefon", flex: 1 },

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
              onClick={() => handleViewTeachers(params.row.id)}
              sx={{ marginRight: 1 }}
            >
              View
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleUpdateTeachers(params.row.id)}
              sx={{ marginRight: 1 }}
            >
              Update
            </Button>
            {/* <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDeleteTeachers(params.row.id)}
            >
              Delete
            </Button> */}
          </Box>
        ),
      },
    ];
  
    // teacher Data
  const [teachers, setTeachers] = useState([]);

    const getTeachers = async () => {
      try {
          const response = await axios.get('http://127.0.0.1:8000/api/teacherprofile/');
          const dataWithIds = response.data.map((item) => ({ ...item, id: item.id }));
          setTeachers(dataWithIds);
      } catch (error) {
          console.error("Error fetching teacher data:", error);
      }
  };
  
  
  const handleViewTeachers = (teacherId) => {
      // Redirect to the view teacher page with the ID as a parameter
      window.location.href = `/viewprofileteacher/${teacherId}`;
  };

  const handleUpdateTeachers = (teacherId) => {
      window.location.href = `/updateteacher/${teacherId}`;
  }

  const handleDeleteTeachers = async (teacherId) => {
      try {
          // Make an HTTP DELETE request to delete the teacher with the given ID
          await axios.delete(`http://127.0.0.1:8000/api/teacherprofile/${teacherId}`);
          // Optionally, you can update the UI to reflect the deletion by removing the deleted teacher from the state or refetching the teacher data
          console.log(`Teacher with ID ${teacherId} deleted successfully.`);
          // Refresh the teacher data after deletion
          // allert message with show the id
          alert(`Teacher with ID ${teacherId} deleted successfully.`);
          getTeachers();
      } catch (error) {
          console.error(`Error deleting teacher with ID ${teacherId}:`, error);
          // Optionally, you can display an error message to the user
          alert(`Error deleting teacher with ID ${teacherId}. Please try again later.`);
      }
  };

  // end teacher data
    
  // Fetch School Session and teacher data on component mount
  useEffect(() => {
    getTeachers();
  }, []);

  const currentUserRole = localStorage.getItem('role');

    return (
      <Box m="10px">
          <Header 
              title="GURU" 
              subtitle="Senarai guru di APCPJ" 
          /> 
          {currentUserRole === 'ADMIN' && (
          <Box m="10px 0 0 0">
            {/* Add New Button start */}
            <Link to="/register-teacher">

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
          )}
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
            rows={teachers} 
            columns={columnsTeacher}
            getRowId={(row) => row.id}
            slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </Box>
    );
};

export default Teachers;