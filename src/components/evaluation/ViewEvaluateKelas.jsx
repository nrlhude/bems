// file path :  frontend/src/components/evaluation/ViewEvaluateKelas.jsx
// `/viewevaluatekelas/${evaluateId}`
// route path /viewevaluatekelas/:evaluateId

import Header from "../Header";
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const ViewEvaluateKelas = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { evaluateId } = useParams();
    const [loading, setLoading] = useState(false);

    const [evaluateKelas, setEvaluateKelas] = useState({});

    const [studentEvaluate, setStudentEvaluate] = useState([]);
    const [studentEvaluateLoading, setStudentEvaluateLoading] = useState(true);

    const filteredStudentEvaluate = studentEvaluate.filter(item => item.evaluate_id === parseInt(evaluateId));
    console.log('filteredStudentEvaluate', filteredStudentEvaluate);

    useEffect(() => {
        const fetchEvaluateKelas = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/evaluate-kelas/${evaluateId}/`);
                setEvaluateKelas(response.data);
                console.log('evaluateKelas', response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching evaluate kelas', error);
                setLoading(false);
            }
        };

        const fetchStudentEvaluate = async () => {
            try {
                const studentResponse = await axios.get('http://127.0.0.1:8000/api/studentprofile/');
                const studentNameMap = new Map(studentResponse.data.map(student => [student.id, student.full_name]));
        
                const evaResponse = await axios.get('http://127.0.0.1:8000/api/evaluate-kelas/');
                const evaMap = new Map(evaResponse.data.map(eva => [eva.evaluate_id, eva.evaluate_name]));
                const evaKelasMap = new Map(evaResponse.data.map(eva => [eva.evaluate_id, eva.kelassession_id]));
        
                const enrolResponse = await axios.get('http://127.0.0.1:8000/api/kelas-session/');
                const kelasMap = new Map(enrolResponse.data.map(kelas => [kelas.kelassession_id, kelas.kelassession_name]));
        
                const response = await axios.get('http://127.0.0.1:8000/api/student-evaluate/');
                console.log('studentEvaluateREs', response.data);
        
                const dataWithIds = response.data.map((item) => ({
                    ...item,
                    studentevaluate_id: item.studentevaluate_id,
                    id_student: item.student_id,
                    id_evaluate: item.evaluate_id,
                    term: item.term,
                    evaluate_date: item.evaluate_date,
                    status: item.status,
                    student_name: studentNameMap.get(item.student_id) || ' ',
                    evaluate_name: evaMap.get(item.evaluate_id) || ' ',
                    kelas_name: kelasMap.get(item.kelassession_id) || ' ',
                }));
        
                setStudentEvaluate(dataWithIds);
                console.log('studentEvaluate', dataWithIds);
                setStudentEvaluateLoading(false);
            } catch (error) {
                console.error('Error fetching student evaluate', error);
                setStudentEvaluateLoading(false);
            }
        };
        
        fetchEvaluateKelas();
        fetchStudentEvaluate();
    }, [evaluateId]);

    const columnsStudentEvaluate = [
        { field: 'student_name', headerName: 'Student Name', flex: 1 },
        { field: 'kelas_name', headerName: 'Kelas', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        { field: 'actions', headerName: 'Actions', flex: 1, renderCell: (params) => (
            <Box display="flex" alignItems="center">
                {params.row.status !== 'Not Created' && (
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ marginRight: 1 }}
                    component={RouterLink}
                    to={`/viewstudentevaluate/${params.row.studentevaluate_id}`}
                >
                    View
                </Button>
                )}
                {params.row.status === 'Draft' && (
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ marginRight: 1 }}
                    component={RouterLink}
                    to={`/updatestudentevaluate/${params.row.studentevaluate_id}`}
                >
                    Evaluate
                </Button>
                )}
                {params.row.status === 'Evaluated' && (
                    <Button
                        variant="contained"
                        color="tertiari"
                        size="small"
                        sx={{ marginRight: 1 }}
                        onClick={() => createThisStudentReportEvaluation(params.row.studentevaluate_id, params.row.term, params.row.id_student, params.row.evaluate_date, params.row.evaluate_name, params.row.evaluate_id, params.row.kelassession_id)}
                    >
                        Generate Report
                    </Button>
                )}
                {/* Become status : 'Evaluated and Student Report Generated' */}
                {params.row.status === 'Not Created' && (
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{ marginRight: 1 }}
                        onClick={() => createStdPrestasiEvaluationThisStudent(params.row.studentevaluate_id, params.row.term, params.row.id_student, params.row.evaluate_id, params.row.kelassession_id)}
                    >
                        Create
                    </Button>
                )}
            </Box>
        )},
    ];
    
    // http://127.0.0.1:8000/api/studentreportevaluation/
    const createThisStudentReportEvaluation = async (studentevaluate_id, term, student_id, evaluate_date, evaluate_name, evaluate_id, kelassession_id) => {
        try {
            const data = {
                studentevaluate_id,
                term,
                student_id,
                evaluate_date,
                evaluate_name,
                kelassession_id
            };
            
            await axios.post('http://127.0.0.1:8000/api/studentreportevaluation/', data);
            
            try {
                await axios.put(`http://127.0.0.1:8000/api/student-evaluate/${studentevaluate_id}/`, { 
                    status: 'Evaluated and Student Report Generated',
                    studentevaluate_id,
                    student_id,
                    evaluate_id,
                    kelassession_id,
                });
                alert('Student report evaluation created and status updated successfully.');
            } catch (error) {
                console.error('Error updating student-evaluate status:', error);
                alert('Failed to update student-evaluate status.');
            }
            
            // Refresh page
            window.location.reload();
        } catch (error) {
            console.error('Error creating student report evaluation:', error);
            alert('Failed to create student report evaluation.');
        }
    };
    


    const createStdPrestasiEvaluationThisStudent = async (studentevaluate_id, term, student_id, evaluate_id, kelassession_id) => {
        try {
            // Fetch criteria sorted by subtunjang_id
            const criteriaResponse = await axios.get('http://127.0.0.1:8000/api/stdprestasicriteria/');
            const criteriaList = criteriaResponse.data;
        
            const promises = criteriaList.map(async (criteria) => {
                const data = {
                    studentevaluate_id: studentevaluate_id,
                    cri_id: criteria.cri_id,
                    level_id: null,
                    term: term,
                    student_id: student_id,
                    kelassession_id: kelassession_id,
                };
        
                await axios.post('http://127.0.0.1:8000/api/stdprestasievaluation/', data);
            });
        
            await Promise.all(promises);
        
            try {
                await axios.put(`http://127.0.0.1:8000/api/student-evaluate/${studentevaluate_id}/`, { 
                    status : 'Draft',
                    studentevaluate_id: studentevaluate_id,
                    student_id: student_id,
                    evaluate_id: evaluate_id,
                    kelassession_id: kelassession_id,
                 });
                alert('Status updated successfully.');
            } catch (error) {
                console.error('Error updating status:', error);
                alert('Failed to update status.');
            }

            alert('StdPrestasiEvaluation created successfully.');
            // refreshpage
            window.location.reload();
        } catch (error) {
            console.error('Error creating StdPrestasiEvaluation:', error);
            alert('Failed to create StdPrestasiEvaluation.');
        }
    };
    

    return (
        <Box>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : evaluateKelas ? (
                <Box>
                    <Box m="10px 0 0 20px">
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link component={RouterLink} to="/evaluation" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                Pentaksiran
                            </Link>
                            <Typography color="text.primary"> Penilaian Kelas {evaluateKelas.evaluate_name}</Typography>
                        </Breadcrumbs>
                    </Box>

                    <Box m="10px 0 0 20px">
                        <Header title={ `Penilaian Kelas ${evaluateKelas.evaluate_name}`}/>

                        <Box boxShadow={15} p="10px" mt="20px">
                            <TextField
                                name="evaluate_date"
                                label="Tarikh Penilaian"
                                value={evaluateKelas.evaluate_date}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '30%' }}
                            />
                            <TextField
                                name="evaluate_name"
                                label="Penilaian"
                                value={evaluateKelas.evaluate_name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '30%' }}
                            />
                            <TextField
                                name="term"
                                label="Penggal Persekolahan"
                                value={evaluateKelas.term}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '30%' }}
                            />
                        </Box>

                        <Box boxShadow={15} p="10px" mt="20px">
                            <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Senarai Pelajar</Typography>

                            <Box
                                m="10px"
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
                                    rows={filteredStudentEvaluate}
                                    columns={columnsStudentEvaluate}
                                    getRowId={(row) => row.studentevaluate_id}
                                    components={{ Toolbar: GridToolbar }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Typography>Penilaian Kelas not found</Typography>
            )}
        </Box>
    );
};

export default ViewEvaluateKelas;
