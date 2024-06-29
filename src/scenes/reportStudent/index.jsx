// file path : frontend/src/scenes/reportStudent/index.jsx
// route path : /studentreport

import React, { useState, useEffect } from 'react';
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StudentReport = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [studentReport, setStudentReport] = useState([]);
    const [mystudentReport, setMyStudentReport] = useState([]);
    const [sesistudentReport, setSesiStudentReport] = useState([]);
    const [studentReportLoading, setStudentReportLoading] = useState(true);
    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event, newValue) => { setTabValue(newValue); };
    const currentSessionID = localStorage.getItem('schoolsessionID');
    const currentSessionName = localStorage.getItem('schoolsessionName');
    const currentUserID = localStorage.getItem('user_id');
    const currentUserRole = localStorage.getItem('role');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setStudentReportLoading(true);
                const [studentReportResponse, kelasResponse, studentProfileResponse, peopleKelasResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/studentreport/'),
                    axios.get('http://127.0.0.1:8000/api/kelas-session/'),
                    axios.get('http://127.0.0.1:8000/api/studentprofile/'),
                    axios.get('http://127.0.0.1:8000/api/people-kelas/')
                ]);
                console.log("studentReportResponse", studentReportResponse.data);
                console.log("kelasResponse", kelasResponse.data);
                console.log("studentProfileResponse", studentProfileResponse.data);

                const kelasNameMap = new Map(kelasResponse.data.map(kelas => [kelas.kelassession_id, kelas.kelassession_name]));

                const studentNameMap = new Map(studentProfileResponse.data.map(student => [student.id, student.full_name]));
                
                const schsesRes = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
                const sessionMap = new Map(schsesRes.data.map((item) => [item.session_id, item.session_name]));
                
                const dataWithIds = studentReportResponse.data.map((item) => ({
                    ...item,
                    id: item.studentreport_id,
                    student_name: studentNameMap.get(item.student_id) || ' ',
                    kelas_name: kelasNameMap.get(item.kelassession_id) || ' ',
                    sesisekolah: sessionMap.get(item.session_id) || '',
                }));

                setStudentReport(dataWithIds);

                const filteredKelas = peopleKelasResponse.data.filter((item) => item.user_id === parseInt(currentUserID));
                
                const filteredMyStudentReport = dataWithIds.filter((item) => filteredKelas.some((kelas) => kelas.kelassession_id === parseInt(item.kelassession_id)));
                setMyStudentReport(filteredMyStudentReport);

                const filteredSesiStudentReport = dataWithIds.filter((item) => item.session_id === parseInt(currentSessionID));
                setSesiStudentReport(filteredSesiStudentReport);

                setStudentReportLoading(false);
            } catch (error) {
                console.error("Error fetching classes data:", error);
            }
        };
        fetchData();
    }, []);

    const columnsStudentReport = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'student_name', headerName: 'Nama Pelajar', flex: 1 },
        { field: 'kelas_name', headerName: 'Kelas', flex: 0.5 },
        { field: "sesisekolah", headerName: "Sesi Sekolah", flex: 0.5, },
        { field: 'actions', headerName: 'Actions', flex: 1, renderCell: (params) => (
            <Box display="flex" alignItems="center" mt='10px'>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ marginRight: 1 }}
                    component={RouterLink}
                    to={`/viewstudentreport/${params.row.student_id}/${params.row.kelassession_id}`}
                >
                    LAPORAN penilaian
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ marginRight: 1 }}
                    component={RouterLink}
                    to={`/viewstudentexam/${params.row.student_id}/${params.row.kelassession_id}`}
                >
                    KEPUTUSAN PEPERIKSAAN
                </Button>
            </Box>
        )},

    ];



    return (
    <Box m="10px">
        {/* start Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="LAPORAN PELAJAR" subtitle="Senarai Laporan Pelajar di APCPJ" />
        </Box>
        {/* end Header */}   
        <Box boxShadow={15} p="10px" mt="20px" >
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="Tabs">
                <Tab label="My Penilaian Kelas" />
                {currentUserRole !== 'PARENT' && (
                    <Tab label="This School Session" />
                )}
                {currentUserRole !== 'PARENT' && (
                    <Tab label="ALL" />
                )}
                
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
                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>SENARAI LAPORAN PELAJAR SAYA</Typography>
                <DataGrid
                    rows={mystudentReport}
                    columns={columnsStudentReport}
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
                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>SENARAI LAPORAN PELAJAR SESI PERSEKOLAH {currentSessionName}</Typography>
                <DataGrid
                    rows={sesistudentReport}
                    columns={columnsStudentReport}
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
                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>SENARAI SEMUA LAPORAN PELAJAR</Typography>
                <DataGrid
                    rows={studentReport}
                    columns={columnsStudentReport}
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


export default StudentReport;

// 