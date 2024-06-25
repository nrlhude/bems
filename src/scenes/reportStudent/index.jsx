// file path : frontend/src/scenes/reportStudent/index.jsx
// route path : /studentreport

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from "@mui/material";
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
    const [studentReportLoading, setStudentReportLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setStudentReportLoading(true);
                const [studentReportResponse, kelasResponse, studentProfileResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/studentreport/'),
                    axios.get('http://127.0.0.1:8000/api/kelas-session/'),
                    axios.get('http://127.0.0.1:8000/api/studentprofile/')
                ]);
                console.log("studentReportResponse", studentReportResponse.data);
                console.log("kelasResponse", kelasResponse.data);
                console.log("studentProfileResponse", studentProfileResponse.data);

                const kelasNameMap = new Map(kelasResponse.data.map(kelas => [kelas.kelassession_id, kelas.kelassession_name]));

                const studentNameMap = new Map(studentProfileResponse.data.map(student => [student.id, student.full_name]));
                
                const dataWithIds = studentReportResponse.data.map((item) => ({
                    ...item,
                    id: item.studentreport_id,
                    student_name: studentNameMap.get(item.student_id) || ' ',
                    kelas_name: kelasNameMap.get(item.kelassession_id) || ' ',
                }));

                setStudentReport(dataWithIds);
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
        { field: 'kelas_name', headerName: 'Kelas', flex: 1 },
        { field: 'actions', headerName: 'Actions', flex: 1, renderCell: (params) => (
            <Box display="flex" alignItems="center">
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ marginRight: 1 }}
                    component={RouterLink}
                    to={`/viewstudentreport/${params.row.student_id}/${params.row.kelassession_id}`}
                    // pass student_id and kelassession_id to viewstudentreport
                >
                    View Report
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
                    rows={studentReport}
                    columns={columnsStudentReport}
                    getRowId={(row) => row.id}
                    slots={{ toolbar: GridToolbar }}
                />
            </Box>

    </Box>
    );
};


export default StudentReport;