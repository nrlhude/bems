// File Path : frontend/src/scenes/settings/school-sessions.jsx
// Routh Path : /settings/school-sessions

import SettingsWrapper from '../../components/SettingsWrapper';
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

const SettingSesi = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [schoolSessions, setSchoolSessions] = useState([]);

    useEffect(() => {
        getSchoolSessions();
    }, []);

    const getSchoolSessions = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
            const dataWithIds = response.data.map((item) => ({ ...item, id: item.session_id }));
            setSchoolSessions(dataWithIds);
        } catch (error) {
            console.error("Error fetching school sessions data:", error);
        }
    };

    const handleViewSession = (sessionId) => {
        window.location.href = `/viewschoolsession/${sessionId}`;
    };

    const handleUpdateSession = (sessionId) => {
        window.location.href = `/updateschoolsession/${sessionId}`;
    };

    const handleDeleteSession = async (sessionId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/school-sessions/${sessionId}`);
            alert(`Session with ID ${sessionId} deleted successfully.`);
            getSchoolSessions();
        } catch (error) {
            console.error(`Error deleting session with ID ${sessionId}:`, error);
            alert(`Error deleting session with ID ${sessionId}. Please try again later.`);
        }
    };

    const columnsSchoolSessions = [
        { field: "session_name", headerName: "Sesi Persekolahan", flex: 1, cellClassName: "name-column--cell" },
        { field: "session_start_date", headerName: "Tarikh Mula", flex: 0.5 },
        { field: "session_end_date", headerName: "Tarikh Tamat", flex: 0.5 },
        { field: "session_status", headerName: "Status", flex: 0.5, minWidth: 100 },
        {
            field: "actions",
            headerName: "",
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" alignItems="center">
                    {/* <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleViewSession(params.row.id)}
                        sx={{ marginRight: 1 }}
                    >
                        View
                    </Button> */}
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleUpdateSession(params.row.id)}
                        sx={{ marginRight: 1 }}
                    >
                        Update
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteSession(params.row.id)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];


    return (
        <Box boxShadow={50} p="10px">
            <SettingsWrapper>
            <Box boxShadow={15} p="10px">
                <Typography variant="h4" color={colors.greenAccent[400]} gutterBottom>
                    Sesi Persekolahan
                </Typography>
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
                        rows={schoolSessions}
                        columns={columnsSchoolSessions}
                        autoHeight
                        slots={{ toolbar: GridToolbar }}
                        getRowId={(row) => row.id}
                    />
                </Box>
            </Box>
            </SettingsWrapper>
        </Box>
    );
};

export default SettingSesi;
