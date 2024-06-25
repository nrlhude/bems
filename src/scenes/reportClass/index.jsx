// frontend/src/scenes/ClassReport/index.jsx
// route path : /classreport

import React, { useState, useEffect } from 'react';
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';


const ClassReport = () => {
  // LaporanKelas: classreportID, teacherName, teacherAge, teacherPhone, teacherEmail
  // Teacherteacherme : classreportID, teachermeID, sessionID
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    // ClassReport Data
    const columns= [
      { field: "tarikh", headerName: "Tarikh", flex: 0.5 },
      { field: "kelas", headerName: "Kelas Sesi", flex: 0.5 },
      { field: "tajuk", headerName: "Tajuk", flex: 1 },
      { field: "tema", headerName: "Tema", flex: 1 },

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
              onClick={() => handleViewClassReport(params.row.id)}
              sx={{ marginRight: 1 }}
            >
              View
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleUpdateClassReport(params.row.id)}
              sx={{ marginRight: 1 }}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDeleteClassReport(params.row.id)}
            >
              Delete
            </Button>
          </Box>
        ),
      },
    ];
  
    // LaporanKelas Data
  const [ClassReport, setClassReport] = useState([]);

    const getClassReport = async () => {
      try {
          const response = await axios.get(`http://127.0.0.1:8000/api/report-class/`);
          const dataWithIds = response.data.map((item) => ({ ...item, id: item.id }));
          setClassReport(dataWithIds);
      } catch (error) {
          console.error("Error fetching Laporan Kelas data:", error);
      }
  };
  
  
  const handleViewClassReport = (classreportID) => {
      // Redirect to the view LaporanKelas page with the ID as a parameter
      window.location.href = `/viewclassreport/${classreportID}`;
  };

  const handleUpdateClassReport = (classreportID) => {
      window.location.href = `/updateclassreport/${classreportID}`;
  }

  const handleDeleteClassReport = async (classreportID) => {
      try {
          // Make an HTTP DELETE request to delete the LaporanKelas with the given ID
          await axios.delete(`http://127.0.0.1:8000/api/report-class/${classreportID}/`);
          // Optionally, you can update the UI to reflect the deletion by removing the deleted LaporanKelas from the state or refetching the LaporanKelas data
          console.log(`Laporan Kelas with ID ${classreportID} deleted successfully.`);
          // Refresh the LaporanKelas data after deletion
          // allert message with show the id
          alert(`Laporan Kelas with ID ${classreportID} deleted successfully.`);
          getClassReport();
      } catch (error) {
          console.error(`Error deleting Laporan Kelas with ID ${classreportID}:`, error);
          // Optionally, you can display an error message to the user
          alert(`Error deleting Laporan Kelas with ID ${classreportID}. Please try again later.`);
      }
  };

  // end LaporanKelas data
    
  // Fetch School Session and LaporanKelas data on component mount
  useEffect(() => {
    getClassReport();
  }, []);


    return (
      <Box m="10px">
          <Header 
              title="LAPORAN KELAS" 
              subtitle="Senarai laporan kelas di APCPJ" 
          /> 
          <Box m="10px 0 0 0">
            {/* Add New Button start */}
            <Link to="/createclassreport">

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
            rows={ClassReport} 
            columns={columns}
            getRowId={(row) => row.id}
            slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </Box>
    );
};

export default ClassReport;