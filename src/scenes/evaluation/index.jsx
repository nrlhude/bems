// file path : frontend/src/scenes/evaluation/index.jsx
// route path : /evaluation

import React, { useState, useEffect } from 'react';
import Header from "../../components/Header";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const Evaluation = () => {
    const [evaluateKelas, setEvaluateKelas] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [loading, setLoading] = useState(false);
    const [studentEvaluate, setStudentEvaluate] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch evaluate-kelas and student-evaluate data
                const [evaluateKelasResponse, studentEvaluateResponse, enrolResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/evaluate-kelas/'),
                    axios.get('http://127.0.0.1:8000/api/student-evaluate/'),
                    axios.get('http://127.0.0.1:8000/api/kelas-session/')
                ]);

                const kelasMap = new Map(enrolResponse.data.map(kelas => [kelas.kelassession_id, kelas.kelassession_name]));

                const dataWithIds = evaluateKelasResponse.data.map((item) => ({
                    ...item,
                    id: item.evaluate_id,
                    kelassession_name: kelasMap.get(item.kelassession_id) || '',
                }));

                // Set states
                setEvaluateKelas(dataWithIds);
                setStudentEvaluate(dataWithIds);
                console.log("studentEvaluate", dataWithIds);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching evaluation data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columnsEvaluateKelas = [
        { field: "kelassession_name", headerName: "Kelas", flex: 0.5, minWidth: 100 },
        { field: "evaluate_date", headerName: "Tarikh Penilaian", flex: 0.5, minWidth: 100 },
        { field: "evaluate_name", headerName: "Nama Penilaian", flex: 0.5, minWidth: 100 },
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
                {/* Display DataGrid for evaluate-kelas */}
                <DataGrid
                    rows={evaluateKelas}
                    columns={columnsEvaluateKelas}
                    getRowId={(row) => row.evaluate_id}
                    slots={{ toolbar: GridToolbar }}
                />
            </Box>
        </Box>
    );
};

export default Evaluation;
