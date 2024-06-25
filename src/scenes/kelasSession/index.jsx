// file path : frontend/src/scenes/kelasSession/index.jsx
// route path : /kelassession

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const KelasSession = () => {
    const [kelasEnrol, setKelasEnrol] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [loading, setLoading] = useState(false);
    const [peopleKelas, setPeopleKelas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [enrolResponse, sessionResponse, kelasResponse, peopleKelasResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/kelas-session/'),
                    axios.get('http://127.0.0.1:8000/api/school-sessions/'),
                    axios.get('http://127.0.0.1:8000/api/kelass/'),
                    axios.get('http://127.0.0.1:8000/api/people-kelas/')
                ]);

                // Set states
                setPeopleKelas(peopleKelasResponse.data);
                console.log("peopleKelas", peopleKelasResponse.data);

                const sessionsMap = new Map(sessionResponse.data.map(session => [session.session_id, session.session_name]));
                const kelasMap = new Map(kelasResponse.data.map(kelas => [kelas.kelas_id, kelas.kelas_name]));

                // Calculate num_teacher and num_student based on peopleKelas
                const dataWithIds = enrolResponse.data.map((item) => {
                    // Filter peopleKelas for teachers
                    const num_teachers = peopleKelas.filter(p => p.kelassession_id === item.kelassession_id && p.role === 'GURU').length;
                    
                    // Filter peopleKelas for students
                    const num_students = peopleKelas.filter(p => p.kelassession_id === item.kelassession_id && p.role === 'PELAJAR').length;

                    setLoading(true);


                    return {
                        ...item,
                        id: item.kelassession_id,
                        session_name: sessionsMap.get(item.session_id) || '',
                        kelas_name: kelasMap.get(item.kelas_id) || '',
                        num_teachers,
                        num_students,
                    };

                    setLoading(false);
                });

                setKelasEnrol(dataWithIds);
                console.log(dataWithIds);
            } catch (error) {
                console.error("Error fetching classes data:", error);
            }
        };

        fetchData();
    }, []);

    const handleViewKelasEnrol = (kelassessionId) => {
        window.location.href = `/viewkelassession/${kelassessionId}`;
    };

    const handleUpdateKelasEnrol = (kelassessionId) => {
        window.location.href = `/updatekelassession/${kelassessionId}`;
    };

    const columnsKelasEnrol = [
        { field: "kelassession_id", headerName: "ID", flex: 0.5, minWidth: 100 },
        { field: "kelassession_name", headerName: "Nama Kelas", flex: 0.5, minWidth: 100 },
        { field: "kelas_name", headerName: "Kelas", flex: 0.5, minWidth: 100 },
        { field: "session_name", headerName: "Sesi Persekolahan", flex: 0.5, minWidth: 100 },
        // { field: "num_teachers", headerName: "Bilangan Guru", flex: 0.5, minWidth: 100 },
        // { field: "num_students", headerName: "Bilangan Pelajar", flex: 0.5, minWidth: 100 },
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
                        sx={{ marginRight: 1 }}
                        onClick={() => handleViewKelasEnrol(params.row.id)}
                    >
                        View
                    </Button>
                    {/* <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleUpdateKelasEnrol(params.row.id)}
                        sx={{ marginRight: 1 }}
                    >
                        Update
                    </Button> */}
                </Box>
            ),
        },
    ];

    return (
        <Box m="10px">
            <Header
                title="KELAS"
                subtitle="Senarai kelas di APCPJ"
            />
            <Box m="10px 0 0 0">
                <Link to="/createkelassession">
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
                    rows={kelasEnrol}
                    columns={columnsKelasEnrol}
                    getRowId={(row) => row.id}
                    slots={{ toolbar: GridToolbar }}
                />
            </Box>
        </Box>
    );
};

export default KelasSession;
