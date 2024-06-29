// file path : frontend/src/scenes/rph/index.jsx
// route path : /rph

import React, { useState, useEffect } from 'react';
import { Box, Button, Tab, Tabs, Typography} from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RPH = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rph, setRPH] = useState([]);
    const [rphSesi, setRPHSesi] = useState([]);
    const [myrph, setMyRPH] = useState([]);

    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event, newValue) => { setTabValue(newValue); };
    const currentSessionID = localStorage.getItem('schoolsessionID');
    const currentSessionName = localStorage.getItem('schoolsessionName');
    const currentUserID = localStorage.getItem('user_id');

    console.log('currentSessionID in rph',currentSessionID);
    console.log('currentSessionName in rph',currentSessionName);
    console.log('rph', rph);
    const columnsRPH = [
        { field: "tarikh", headerName: "Tarikh", flex: 0.5 },
        { field: "masa", headerName: "Masa", flex: 0.5 },
        { field: "tajuk", headerName: "Tajuk", flex: 1 },
        { field: "tema", headerName: "Tema", flex: 0.5 },
        { field: "kelas", headerName: "Kelas Sesi", flex: 0.5},
        { field: "sesisekolah", headerName: "Sesi", flex: 0.5},
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
                        onClick={() => handleViewRPH(params.row.id)}
                        sx={{ marginRight: 1 }}
                    >
                        View
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleUpdateRPH(params.row.id)}
                        sx={{ marginRight: 1 }}
                    >
                        Update
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDuplicateRPH(params.row.id)}
                        sx={{ marginRight: 1 }}
                    >
                        Duplicate
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteRPH(params.row.id)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    const getRPH = async () => {
        try {
            const schsesRes = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
            const sessionMap = new Map(schsesRes.data.map((item) => [item.session_id, item.session_name]));

            const response = await axios.get('http://127.0.0.1:8000/api/rph/');

            
            const dataWithIds = response.data.map((item) => ({ ...item, id: item.id, sesisekolah: sessionMap.get(item.session_id)}));
            setRPH(dataWithIds);

            const currentSessionRPH = dataWithIds.filter((item) => item.session_id === parseInt(currentSessionID));
            setRPHSesi(currentSessionRPH);

            const myRPH = dataWithIds.filter((item) => item.created_by === parseInt(currentUserID));
            setMyRPH(myRPH);

            
        } catch (error) {
            console.error("Error fetching RPH data:", error);
        }
    };

    const handleViewRPH = (rphId) => {
        window.location.href = `/viewrph/${rphId}`;
    };

    const handleUpdateRPH = (rphId) => {
        window.location.href = `/updaterph/${rphId}`;
    };
    const handleDuplicateRPH = async (rphId) => {
        try {
            // Fetch the details of the RPH to be duplicated
            const response = await axios.get(`http://127.0.0.1:8000/api/rph/${rphId}/`);
            const rphDetails = response.data;

            // Remove the id to avoid conflicts
            delete rphDetails.id;

            // Create a new RPH with the same details
            await axios.post('http://127.0.0.1:8000/api/rph/', rphDetails);

            alert(`RPH with ID ${rphId} duplicated successfully.`);
            getRPH();
        } catch (error) {
            console.error(`Error duplicating RPH with ID ${rphId}:`, error);
            alert(`Error duplicating RPH with ID ${rphId}. Please try again later.`);
        }
    };

    const handleDeleteRPH = async (rphId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/rph/${rphId}/`);
            alert(`RPH with ID ${rphId} deleted successfully.`);
            getRPH();
        } catch (error) {
            console.error(`Error deleting RPH with ID ${rphId}:`, error);
            alert(`Error deleting RPH with ID ${rphId}. Please try again later.`);
        }
    };

    useEffect(() => {
        getRPH();
    }, []);

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="RUTIN PENGAJARAN HARIAN (RPH)" subtitle="Senarai RPH" />
            </Box>
            <Box m="20px 0 0 0">
                <Link to="/createrph">
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
            </Box>

            <Box boxShadow={15} p="10px" mt="20px"
                >

                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="Tabs">
                        <Tab label="My RPH" />
                        <Tab label="This School Session" />
                        <Tab label="All" />
                    </Tabs>
            </Box>

            {tabValue === 0 && (
                <Box m="10px" color="text.primary" >
                    
                    <Box boxShadow={10} p="10px" mt="20px"> 
                    <Box
                        m="20px 0 0 0"
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
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>SENARAI RPH SAYA</Typography>
                        <DataGrid 
                            rows={myrph} 
                            columns={columnsRPH}
                            getRowId={(row) => row.id}
                            slots={{ toolbar: GridToolbar }}
                        />
                    </Box>
                    </Box>
                </Box>
            )}
            {tabValue === 1 && (
                <Box m="10px" color="text.primary" >
                    
                    <Box boxShadow={10} p="10px" mt="20px"> 
                    <Box
                        m="20px 0 0 0"
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
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>SENARAI RPH SESI PERSEKOLAH {currentSessionName}</Typography>
                        <DataGrid 
                            rows={rphSesi} 
                            columns={columnsRPH}
                            getRowId={(row) => row.id}
                            slots={{ toolbar: GridToolbar }}
                        />
                    </Box>
                    </Box>
                </Box>
            )}
            {tabValue === 2 && (
                <Box m="10px" color="text.primary" >
                    
                    <Box boxShadow={10} p="10px" mt="20px"> 
                    <Box
                        m="20px 0 0 0"
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
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>SENARAI SEMUA RPH</Typography>
                        <DataGrid 
                            rows={rph} 
                            columns={columnsRPH}
                            getRowId={(row) => row.id}
                            slots={{ toolbar: GridToolbar }}
                        />
                    </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default RPH;
