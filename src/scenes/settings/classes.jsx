// File Path : frontend/src/scenes/settings/classes.jsx
// Route Path : /settings/classes

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

const SettingClasses = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        getClasses();
    }, []);

    const getClasses = async () => {
        try {
            const classResponse = await axios.get('http://127.0.0.1:8000/api/kelass');
            // const sessionResponse = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
            // const sessionsMap = new Map(sessionResponse.data.map(session => [session.session_id, session.session_name]));
            // console.log(sessionsMap);
            // created by teacher : first_name + ' ' + last_name
            // const createdByResponse = await axios.get('http://127.0.0.1:8000/api/teacher/');
            // const createdByMap = new Map(createdByResponse.data.map(teacher => [teacher.id , teacher.first_name + ' ' + teacher.last_name]));
            // console.log(createdByMap);
            const dataWithIds = classResponse.data.map((item) => ({
                ...item,
                id: item.kelas_id,
                // session_name: sessionsMap.get(item.session_id) || ' ',
                // teacher_by: createdByMap.get(item.created_by) || ' ',
            }));
            setClasses(dataWithIds);
        } catch (error) {
            console.error("Error fetching classes data:", error);
        }
    };
    

    const handleViewClass = (classId) => {
        window.location.href = `/viewclass/${classId}`;
    };

    const handleUpdateClass = (classId) => {
        window.location.href = `/updateclass/${classId}`;
    };

    const handleDeleteClass = async (classId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/kelass/${classId}`);
            alert(`Class with ID ${classId} deleted successfully.`);
            getClasses();
        } catch (error) {
            console.error(`Error deleting class with ID ${classId}:`, error);
            alert(`Error deleting class with ID ${classId}. Please try again later.`);
        }
    };

    const columnsClasses = [
        { field: "kelas_name", headerName: "Kelas", flex: 0.5, cellClassName: "name-column--cell" },
        { field: "kelas_code", headerName: "Kod Kelas", flex: 0.5 },
        { field: "kelas_desc", headerName: "Keterangan Kelas", flex: 1 },
        { field: "kelas_status", headerName: "Status", flex: 0.5, minWidth: 100 },
        // {
        //     field: "session_name",
        //     headerName: "Sesi Persekolahan",
        //     flex: 0.5,
        //     minWidth: 100,
        // },
        //  { field: "teacher_by", headerName: "Created by", flex: 0.5, minWidth: 100 },
        {   field: "actions",
            headerName: "",
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" alignItems="center">
                    {/* <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleViewClass(params.row.id)}
                        sx={{ marginRight: 1 }}
                    >
                        View
                    </Button> */}
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleUpdateClass(params.row.id)}
                        sx={{ marginRight: 1 }}
                    >
                        Update
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClass(params.row.id)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box m="10px">
            <SettingsWrapper>
            <Box boxShadow={15} p="10px">
                <Typography variant="h4" color={colors.greenAccent[400]} gutterBottom>
                    Kelas
                </Typography>
                <Box m="10px 0 0 0">
                            {/* Add New Button start */}
                                <Link to="/createclasses">

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
                        rows={classes}
                        columns={columnsClasses}
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

export default SettingClasses;
