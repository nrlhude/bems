// frontend/src/components/SettingsWrapper.js
// frontend/src/scenes/settings/program.jsx


import SettingsWrapper from '../../components/SettingsWrapper';
import React, { useState, useEffect } from 'react';
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SettingProgram = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        getPrograms();
    }, []);

    const getPrograms = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/programmes');
            const dataWithIds = response.data.map((item) => ({ ...item, id: item.programme_id }));
            setPrograms(dataWithIds);
        } catch (error) {
            console.error("Error fetching programs data:", error);
        }
    };

    const handleViewProgram = (programId) => {
        window.location.href = `/viewprogram/${programId}`;
    };

    const handleUpdateProgram = (programId) => {
        window.location.href = `/updateprogram/${programId}`;
    };

    const handleDeleteProgram = async (programId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/programmes/${programId}`);
            alert(`Program with ID ${programId} deleted successfully.`);
            getPrograms();
        } catch (error) {
            console.error(`Error deleting program with ID ${programId}:`, error);
            alert(`Error deleting program with ID ${programId}. Please try again later.`);
        }
    };

    const columnsPrograms = [
        { field: "programme_name", headerName: "Program", flex: 1, cellClassName: "name-column--cell" },
        { field: "programme_code", headerName: "Kod Program", flex: 0.5 },
        { field: "programme_status", headerName: "Status", flex: 0.5, minWidth: 100 },
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
                        onClick={() => handleViewProgram(params.row.id)}
                        sx={{ marginRight: 1 }}
                    >
                        View
                    </Button> */}
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleUpdateProgram(params.row.id)}
                        sx={{ marginRight: 1 }}
                    >
                        Update
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteProgram(params.row.id)}
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
                        Programs
                    </Typography>
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
                            rows={programs}
                            columns={columnsPrograms}
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

export default SettingProgram;