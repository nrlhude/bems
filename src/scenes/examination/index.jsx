// file path: frontend/src/scenes/examination/index.jsx
// route path: /examination

import React, { useState, useEffect } from 'react';
import Header from "../../components/Header";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const Examination = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [examKelas, setExamKelas] = useState([]);
    const [myExamKelas, setMyExamKelas] = useState([]);
    const [sesiExamKelas, setSesiExamKelas] = useState([]);

    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event, newValue) => { setTabValue(newValue); };

    const currentSessionID = localStorage.getItem('schoolsessionID');
    const currentSessionName = localStorage.getItem('schoolsessionName');
    const currentUserID = localStorage.getItem('user_id');
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch exam-kelas and student-exam data
                const [examKelasRes, peopleKelasRes, kelassessionRes, schoolsessionRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/examkelas/'),
                    axios.get('http://127.0.0.1:8000/api/people-kelas/'),
                    axios.get('http://127.0.0.1:8000/api/kelas-session/'),
                    axios.get('http://127.0.0.1:8000/api/school-sessions/')
                ]);

                const sessionMap = new Map(schoolsessionRes.data.map((item) => [item.session_id, item.session_name]));
                const kelasMap = new Map(kelassessionRes.data.map(kelas => [kelas.kelassession_id, kelas.kelassession_name]));

                const dataWithIds = examKelasRes.data.map((item) => ({
                    ...item,
                    id: item.examkelas_id,
                    kelassession_name: kelasMap.get(item.kelassession_id) || '',
                    sesisekolah: sessionMap.get(item.session_id) || '',
                }));

                setExamKelas(dataWithIds);

                const filteredKelas = peopleKelasRes.data.filter((item) => item.user_id === parseInt(currentUserID));
                const filteredMyExamKelas = dataWithIds.filter((item) => filteredKelas.some((kelas) => kelas.kelassession_id === parseInt(item.kelassession_id)));
                setMyExamKelas(filteredMyExamKelas);

                const filteredSesiExamKelas = dataWithIds.filter((item) => item.session_id === parseInt(currentSessionID));
                setSesiExamKelas(filteredSesiExamKelas);
                
                setLoading(false);
            }
            catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
        document.title = 'Peperiksaan';
    }, []);

    console.log('examKelas', examKelas);
    console.log('myExamKelas', myExamKelas);
    console.log('sesiExamKelas', sesiExamKelas);

    // field: kessesion_name, term, sesisekolah, action(view)
    const columnsExamKelas = [
        { field: "kelassession_name", headerName: "Kelas", flex: 0.5 },
        { field: "term", headerName: "Penggal Persekolahan", flex: 0.5 },
        { field: "sesisekolah", headerName: "Sesi Persekolahan", flex: 0.5 },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" alignItems="center" mt='10px'>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ marginRight: 1 }}
                        onClick={() => handleViewEvaluation(params.row.examkelas_id)}
                    >
                        View
                    </Button>
                    {/* Add additional actions as needed */}
                </Box>
            ),
        },
    ];

    const handleViewEvaluation = (examkelas_id) => {
        window.location.href = `/viewexamkelas/${examkelas_id}`;
    };


    return (
        <Box  m="10px">
            <Header title="PEPERIKSAAN PELAJAR" />
            <Box m="10px 0 0 20px">
                {/* Add link to create new evaluation */}
                <Link to="/createexamkelas">
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
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="My Keputusan Peperiksaan Kelas" />
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
                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>SENARAI KEPUTUSAN PEPERIKSAAN SAYA</Typography>
                <DataGrid
                    rows={myExamKelas}
                    columns={columnsExamKelas}
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
                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>SENARAI KEPUTUSAN PEPERIKSAAN SESI PERSEKOLAH {currentSessionName}</Typography>
                <DataGrid
                    rows={sesiExamKelas}
                    columns={columnsExamKelas}
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
                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>SENARAI SEMUA KEPUTUSAN PEPERIKSAAN</Typography>
                <DataGrid
                    rows={examKelas}
                    columns={columnsExamKelas}
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

export default Examination;