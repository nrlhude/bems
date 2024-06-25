import React, { useState } from 'react';
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from "react";
// import { format } from 'date-fns';

const Thin = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // School Session Data
    const columnsSchoolSession = [
        { field: "session_name", headerName: "Session Name", flex: 1, cellClassName: "name-column--cell" },
        { field: "session_start_date", headerName: "Start Date", flex: 0.5 },
        { field: "session_end_date", headerName: "End Date", flex: 0.5}, 
        { field: "session_status", headerName: "Status", flex: 0.5, minWidth: 100 }, 
        // session_id
        { field: "session_id", headerName: "Session ID", flex: 0.5},
        // field created at and update at format 'dd/MM/yyyy HH:mm:ss'
        // { field: "created_at", headerName: "Created At", flex: 0.5 },
        // { field: "updated_at", headerName: "Updated At", flex: 0.5 },
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
                onClick={() => handleViewSession(params.row.session_id)}
                sx={{ marginRight: 1 }}
              >
                View
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleUpdateSession(params.row.session_id)}
                sx={{ marginRight: 1 }}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDeleteSession(params.row.session_id)}
              >
                Delete
              </Button>
            </Box>
          ),
        },
      ];
    
      // School Session Data
    const [schoolSession, setSchoolSessions] = useState([]);

      const getSchoolSession = async () => {
          try {
              const response = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
              const dataWithIds = response.data.map((item) => ({ ...item, id: item.session_id }));
                setSchoolSessions(dataWithIds);
          } catch (error) {
              console.error('Error fetching school sessions:', error);
          }
      };
    
    const handleViewSession = (sessionId) => {
        // Redirect to the view school session page with the session ID as a parameter
        window.location.href = `/viewschoolsession/${sessionId}`;
    };

    const handleUpdateSession = (sessionId) => {
        // Redirect to the update school session page with the session ID as a parameter
        window.location.href = `/updateschoolsession/${sessionId}`;
    };
    
    const handleDeleteSession = async (sessionId) => {
        try {
            // Make an HTTP DELETE request to delete the session with the given ID
            await axios.delete(`http://127.0.0.1:8000/api/school-sessions/${sessionId}`);
            // Optionally, you can update the UI to reflect the deletion by removing the deleted session from the state or refetching the session data
            console.log(`Session with ID ${sessionId} deleted successfully.`);
            // Refresh the session data after deletion
            // allert message with show the id
            alert(`Session with ID ${sessionId} deleted successfully.`);
            getSchoolSession();
        } catch (error) {
            console.error(`Error deleting session with ID ${sessionId}:`, error);
            // Optionally, you can display an error message to the user
            alert(`Error deleting session with ID ${sessionId}. Please try again later.`);
        }
    };


    // end School Session Data

    // program data

    const columnsProgram = [
        { field: "programme_name", headerName: "Program Name", flex: 1, cellClassName: "name-column--cell" },
        { field: "programme_code", headerName: "Program Code", flex: 0.5 },
        { field: "programme_status", headerName: "Status", flex: 0.5, minWidth: 100 },

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
                onClick={() => handleViewProgram(params.row.program_name)}
                sx={{ marginRight: 1 }}
              >
                View
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleUpdateProgram(params.row.program_id)}
                sx={{ marginRight: 1 }}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDeleteProgram(params.row.program_id)}
              >
                Delete
              </Button>
            </Box>
          ),
        },
      ];
    
      // Program Data
    const [program, setPrograms] = useState([]);

      const getProgram = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/programmes/');
            const dataWithIds = response.data.map((item) => ({ ...item, id: item.programme_id }));
            setPrograms(dataWithIds);
        } catch (error) {
            console.error("Error fetching program data:", error);
        }
    };
    
    
    const handleViewProgram = (programId) => {
        // Redirect to the view program page with the program ID as a parameter
        window.location.href = `/viewprogram/${programId}`;
    };

    const handleUpdateProgram = (programId) => {
        // Redirect to the update program page with the program ID as a parameter
        window.location.href = `/updateprogram/${programId}`;
    }

    const handleDeleteProgram = async (programId) => {
        try {
            // Make an HTTP DELETE request to delete the program with the given ID
            await axios.delete(`http://127.0.0.1:8000/api/programmes/${programId}`);
            // Optionally, you can update the UI to reflect the deletion by removing the deleted program from the state or refetching the program data
            console.log(`Program with ID ${programId} deleted successfully.`);
            // Refresh the program data after deletion
            // allert message with show the id
            alert(`Program with ID ${programId} deleted successfully.`);
            getProgram();
        } catch (error) {
            console.error(`Error deleting program with ID ${programId}:`, error);
            // Optionally, you can display an error message to the user
            alert(`Error deleting program with ID ${programId}. Please try again later.`);
        }
    };

    // end program data

    // Fetch School Session and Program data on component mount
    useEffect(() => {
        getSchoolSession();
        getProgram();
    }, []);

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const [subTabValue, setSubTabValue] = React.useState(0);    

    const handleSubTabChange = (event, newValue) => {
        setSubTabValue(newValue);
    }



    
    return (
        <Box m="10px">
          {/* start Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="SETTINGS" subtitle="" />
        </Box>
        {/* end Header */}
            

            <Tabs value={tabValue} onChange={handleTabChange} aria-label="Tabs">
              <Tab label="Sesi" />
              <Tab label="Program" />
              <Tab label="Kelas" />
              <Tab label="Jadual Waktu" />
              <Tab label="KSPK" />
              
            </Tabs>
            
            {/* Sesi : Name, Tarikh Mula, Tarikh Akhir */}
            {/* Program : Nama Program */}
            {/* Kelas : Nama Kelas, Nama Guru*/}
            {/* Jadual Waktu : Nama Aktiviti, Bahasa Pelaksanaan*/}
            {/* KSPK */}
                {/* Tunjang Utama : TUID, Kod Tunjang, Nama Tunjang, Tajuk */}
                {/* Sub Tunjang : STID, Kod Sub Tunjang, Nama Sub Tunjang, Tajuk, Penerangan, TUID */}
                {/* Fokus : FID, Kod Sub Tunjang, No, Nama, Tajuk, Penerangan, STID */}
                {/* Kesepaduan Tunjang : */}
                {/* Standard Kandungan : SKID, Kod Sub Tunjang, No, Nama, Tajuk, Penerangan, STID, FID,  */}
                {/* Standard Pembelajaran : : SPID, Kod Sub Tunjang, No, Nama, Tajuk, Penerangan, STID, FID, SPID */}
                {/* Penerapan Nilai : Nama Nilai*/}

            {/* Sesi start */}
            {tabValue === 0 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Sesi Pembelajaran</Typography>
                    <Box m="10px 0 0 0">
                            {/* Add New Button start */}
                                <Link to="/createschoolsession">

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
                        m="5px 0 0 0"
                        height="70vh"
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
                            
                            rows={schoolSession}
                            columns={columnsSchoolSession}
                            getRowId={(row) => row.id}
                            slots={{ toolbar: GridToolbar }}
                            disableColumnResize={false}
                        />
                        {/* checkboxSelection */}
                    </Box>
                </Box>
            )}
            {/* Sesi ends */}

            {/* Program start */}
            {tabValue === 1 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Program</Typography>
                    {/* Content for Program Tab */}
                    <Box m="10px 0 0 0">
                            {/* Add New Button start */}
                                <Link to="/createprogram">

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
                    <Box m="5px 0 0 0"
                        height="70vh"
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
                            rows={program}
                            columns={columnsProgram}
                            getRowId={(row) => row.id}
                            slots={{ toolbar: GridToolbar }}
                        />
                    </Box>

                </Box>
            )}
            {/* Program ends */}

            {tabValue === 2 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Kelas</Typography>
                    {/* Content for Kelas Tab */}
                </Box>
            )}

            {tabValue === 3 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Jadual Waktu</Typography>
                    {/* Content for Jadual Waktu Tab */}
                </Box>
            )}

            {tabValue === 4 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>KSPK</Typography>
                    {/* Content for KSPK Tab */}
                    {/* Tab for  Tunjang Utama, Sub Tunjang, Fokus, Standard Kandungan, Standard Pembelajaran, Penerapan Nilai*/}
                    <Tabs value={subTabValue} onChange={handleSubTabChange} aria-label="SubTabs">
                        <Tab label="Tunjang Utama" />
                        <Tab label="Sub Tunjang" />
                        <Tab label="Fokus" />
                        <Tab label="Standard Kandungan" />
                        <Tab label="Standard Pembelajaran" />
                        <Tab label="Penerapan Nilai" />
                    </Tabs>

                    {subTabValue === 0 && (
                        <Box>
                            {/* Content for Tunjang Utama Tab */}
                            <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Tunjang Utama</Typography>
                            <Box m="10px 0 0 0">
                            {/* Add New Button start */}
                                <Link to="/create">

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
                                m="5px 0 0 0"
                                height="70vh"
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
                                    rows={schoolSession}
                                    columns={columnsSchoolSession}
                                    getRowId={(row) => row.session_id}
                                    slots={{ toolbar: GridToolbar }}
                                />
                            </Box>
                        </Box>
                    )}

                    {subTabValue === 1 && (
                        <Box>
                            {/* Content for Sub Tunjang Tab */}
                        </Box>
                    )}

                    {subTabValue === 2 && (
                        <Box>
                            {/* Content for Fokus Tab */}
                        </Box>
                    )}

                    {subTabValue === 3 && (
                        <Box>
                            {/* Content for Standard Kandungan Tab */}
                        </Box>
                    )}

                    {subTabValue === 4 && (
                        <Box>
                            {/* Content for Standard Pembelajaran Tab */}
                        </Box>
                    )}

                    {subTabValue === 5 && (
                        <Box>
                            {/* Content for Penerapan Nilai Tab */}
                        </Box>
                    )}
                </Box>
            )}

        </Box>
    );
};

export default Thin;
