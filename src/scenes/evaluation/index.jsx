// file path : frontend/src/scenes/evaluation/index.jsx
// route path : /evaluation

import React, { useState, useEffect } from 'react';
import Header from "../../components/Header";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const Evaluation = () => {
    const [evaluateKelas, setEvaluateKelas] = useState([]);
    const [myevaluateKelas, setMyEvaluateKelas] = useState([]);
    const [sesievaluateKelas, setSesiEvaluateKelas] = useState([]);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [loading, setLoading] = useState(false);
    const [studentEvaluate, setStudentEvaluate] = useState([]);
    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event, newValue) => { setTabValue(newValue); };
    const currentSessionID = localStorage.getItem('schoolsessionID');
    const currentSessionName = localStorage.getItem('schoolsessionName');
    const currentUserID = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch evaluate-kelas and student-evaluate data
                const [evaluateKelasResponse, studentEvaluateResponse, enrolResponse, peopleKelasResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/evaluate-kelas/'),
                    axios.get('http://127.0.0.1:8000/api/student-evaluate/'),
                    axios.get('http://127.0.0.1:8000/api/kelas-session/'),
                    axios.get('http://127.0.0.1:8000/api/people-kelas/')
                ]);

                const schsesRes = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
                const sessionMap = new Map(schsesRes.data.map((item) => [item.session_id, item.session_name]));

                const kelasMap = new Map(enrolResponse.data.map(kelas => [kelas.kelassession_id, kelas.kelassession_name]));

                const dataWithIds = evaluateKelasResponse.data.map((item) => ({
                    ...item,
                    id: item.evaluate_id,
                    kelassession_name: kelasMap.get(item.kelassession_id) || '',
                    sesisekolah: sessionMap.get(item.session_id) || '',
                }));

                // Set states
                setEvaluateKelas(dataWithIds);
                setStudentEvaluate(dataWithIds);

                const filteredKelas = peopleKelasResponse.data.filter((item) => item.user_id === parseInt(currentUserID));

                const filteredMyEvaluateKelas = dataWithIds.filter((item) => filteredKelas.some((kelas) => kelas.kelassession_id === parseInt(item.kelassession_id)));
                setMyEvaluateKelas(filteredMyEvaluateKelas);

                const filteredSesiEvaluateKelas = dataWithIds.filter((item) => item.session_id === parseInt(currentSessionID));
                setSesiEvaluateKelas(filteredSesiEvaluateKelas);

                console.log("studentEvaluate", dataWithIds);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching evaluation data:", error);
                setLoading(false);
            }
        };

        fetchData();
        document.title = 'Penilaian Kelas';
    }, []);

    const columnsEvaluateKelas = [
        { field: "kelassession_name", headerName: "Kelas", flex: 0.5 },
        { field: "evaluate_date", headerName: "Tarikh Penilaian", flex: 0.5 },
        { field: "evaluate_name", headerName: "Nama Penilaian", flex: 0.5 },
        { field: "sesisekolah", headerName: "Sesi Sekolah", flex: 0.5},
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" alignItems="center" mt='10px'>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ marginRight: 1 }}
                        onClick={() => handleViewEvaluation(params.row.evaluate_id)}
                    >
                        View
                    </Button>
                    {/* Add additional actions as needed */}
                </Box>
            ),
        },
    ];

    const handleViewEvaluation = (evaluateId) => {
        // Handle navigation to view evaluation details page
        window.location.href = `/viewevaluatekelas/${evaluateId}`;
    };

    return (
        <Box m="10px">
            <Header
                title="PENILAIAN"
                subtitle="Senarai penilaian kelas"
            />
            <Box m="10px 0 0 0">
                {/* Add link to create new evaluation */}
                <Link to="/createevaluatekelas">
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
            <Box boxShadow={15} p="10px" mt="20px" >

                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="Tabs">
                        <Tab label="My Penilaian Kelas" />
                        <Tab label="This School Session" />
                        <Tab label="All" />
                    </Tabs>
            </Box>
            {tabValue === 0 && (
                <Box m="10px" color="text.primary" >
                    
                <Box boxShadow={10} p="10px" mt="20px"> 
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
                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>SENARAI PENILAIAN KELAS SAYA</Typography>
                <DataGrid
                    rows={myevaluateKelas}
                    columns={columnsEvaluateKelas}
                    getRowId={(row) => row.evaluate_id}
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
                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>SENARAI PENILAIAN KELAS SESI PERSEKOLAH {currentSessionName}</Typography>
                <DataGrid
                    rows={sesievaluateKelas}
                    columns={columnsEvaluateKelas}
                    getRowId={(row) => row.evaluate_id}
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
                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>SENARAI SEMUA PENILAIAN KELAS</Typography>
                <DataGrid
                    rows={evaluateKelas}
                    columns={columnsEvaluateKelas}
                    getRowId={(row) => row.evaluate_id}
                    slots={{ toolbar: GridToolbar }}
                />
            </Box>
            </Box>
            </Box>
            )}
        </Box>
    );
};

export default Evaluation;
