// file path : frontend/src/components/evaluation/ViewStudentEvaluate.jsx
// route path : /viewstudentevaluate/:studentevaluateId

import { Box, Breadcrumbs, Typography, TextField, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Link as RouterLink, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const ViewStudentEvaluate = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { studentevaluateId } = useParams();

    const [studentEvaluate, setStudentEvaluate] = useState({});
    const [loading, setLoading] = useState(true);

    const [stdPrestasiEvaluation, setStdPrestasiEvaluation] = useState([]);
    const [stdPrestasiCriteria, setStdPrestasiCriteria] = useState([]);
    const [stdPrestasiLevel, setStdPrestasiLevel] = useState([]);
    const [subtunjang, setSubtunjang] = useState([]);

    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentEvaluateRes, stdPrestasiEvaluationRes, stdPrestasiCriteriaRes, subtunjangRes, stdPrestasiLevelRes, evaluateRes, studentRes, kelassessionRes] = await Promise.all([
                    axios.get(`http://127.0.0.1:8000/api/student-evaluate/${studentevaluateId}/`),
                    axios.get('http://127.0.0.1:8000/api/stdprestasievaluation/'),
                    axios.get('http://127.0.0.1:8000/api/stdprestasicriteria/'),
                    axios.get('http://127.0.0.1:8000/api/sub-tunjang/'),
                    axios.get('http://127.0.0.1:8000/api/stdprestasilevel/'),
                    axios.get('http://127.0.0.1:8000/api/evaluate-kelas/'),
                    axios.get('http://127.0.0.1:8000/api/studentprofile/'),
                    axios.get('http://127.0.0.1:8000/api/kelas-session/')
                ]);

                const studentEvaluateData = studentEvaluateRes.data;
                const evaluateData = evaluateRes.data;
                const studentData = studentRes.data;
                const kelasData = kelassessionRes.data;


                // Map evaluation and student names
                const evaluate = evaluateData.find(e => e.evaluate_id === studentEvaluateData.evaluate_id);
                const student = studentData.find(s => s.id === studentEvaluateData.student_id);
                const kelas = kelasData.find(k => k.kelassession_id === studentEvaluateData.kelassession_id);

                setStudentEvaluate({
                    ...studentEvaluateData,
                    evaluate_name: evaluate ? evaluate.evaluate_name : 'Unknown',
                    student_name: student ? student.full_name : 'Unknown',
                    kelasssession_name: kelas ? kelas.kelassession_name : 'Unknown',
                });

                setStdPrestasiEvaluation(stdPrestasiEvaluationRes.data);
                setStdPrestasiCriteria(stdPrestasiCriteriaRes.data);
                setSubtunjang(subtunjangRes.data);
                setStdPrestasiLevel(stdPrestasiLevelRes.data);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [studentevaluateId]);

    const filteredStdPrestasiEvaluation = stdPrestasiEvaluation
        .filter(item => item.studentevaluate_id === parseInt(studentevaluateId))
        .sort((a, b) => a.cri_id - b.cri_id);
    

    const groupedBySubtunjang = stdPrestasiCriteria.reduce((acc, cri) => {
        const group = filteredStdPrestasiEvaluation.filter(item => item.cri_id === cri.cri_id);
        if (group.length > 0) {
            if (!acc[cri.subtunjang_id]) {
                acc[cri.subtunjang_id] = [];
            }
            acc[cri.subtunjang_id].push({
                cri,
                evaluations: group,
                levels: stdPrestasiLevel.filter(level => level.cri_id === cri.cri_id),
            });
        }
        return acc;
    }, {});
    
    console.log('filteredStdPrestasiEvaluation', filteredStdPrestasiEvaluation);
    console.log('groupedBySubtunjang', groupedBySubtunjang);
    console.log('studentEvaluate', studentEvaluate);
    console.log('stdPrestasiEvaluation', stdPrestasiEvaluation);
    console.log('stdPrestasiCriteria', stdPrestasiCriteria);
    console.log('subtunjang', subtunjang);
    console.log('stdPrestasiLevel', stdPrestasiLevel);

    return (
        <Box>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <Box>
                    <Box m="10px 0 0 20px">
                        <Breadcrumbs aria-label="breadcrumb">
                            <RouterLink to="/evaluation">Pentaksiran</RouterLink>
                            <RouterLink to={`/viewevaluatekelas/${studentEvaluate.evaluate_id}`}>Penilaian Kelas</RouterLink>
                            <Typography>Pentaksiran Pelajar {studentEvaluate.student_name}</Typography>
                        </Breadcrumbs>
                    </Box>
                    <Box m="5px 0 0 20px">
                        <Typography variant="h4" color={colors.greenAccent[400]} gutterBottom>Pentaksiran Pelajar</Typography>
                    </Box>
                    <Box boxShadow={15} p="10px" m="10px 20px">
                        <TextField
                            name="evaluate_name"
                            label="Nama Pentaksiran"
                            value={studentEvaluate.evaluate_name || ''}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '10px', width: '47.5%' }}
                        />
                        <TextField
                            name="evaluate_date"
                            label="Tarikh Pentaksiran"
                            value={studentEvaluate.evaluate_date || ''}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '10px', width: '20%' }}
                        />
                        <TextField
                            name="term"
                            label="Penggal Persekolahan"
                            value={studentEvaluate.term || ''}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '10px', width: '26%' }}
                        />
                        <TextField
                            name="student_name"
                            label="Nama Pelajar"
                            value={studentEvaluate.student_name || ''}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '10px', width: '47.5%' }}
                        />
                        <TextField
                            name="kelas_name"
                            label="Kelas"
                            value={studentEvaluate.kelasssession_name || ''}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '10px', width: '20%' }}
                        />
                        <TextField
                            name="status"
                            label="Status"
                            value={studentEvaluate.status || ''}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '10px', width: '26%' }}
                        />
                    </Box>

                    <Box boxShadow={10} m="20px">
                        <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
                            {subtunjang.map((subTunjang, index) => (
                                <Tab key={index} label={subTunjang.subtunjang_name} />
                            ))}
                            <Tab label="Ulasan Guru" />
                        </Tabs>
                    </Box>

                    {subtunjang.map((subTunjang, index) => (
                        tabValue === index && (
                            <Box boxShadow={10} p="10px" m="20px" key={subTunjang.subtunjang_id}>
                                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>
                                    {subTunjang.subtunjang_name}
                                </Typography>
                                {groupedBySubtunjang[subTunjang.subtunjang_id] && groupedBySubtunjang[subTunjang.subtunjang_id].map((item, idx) => (
                                    <Box key={idx} boxShadow={5} p="10px" m="10px 0">
                                        <TextField
                                            name="cri_desc"
                                            label={`Kriteria Kod : ${item.cri.cri_code}`}
                                            value={item.cri.cri_desc || ''}
                                            InputProps={{ readOnly: true }}
                                            style={{ margin: '10px', width: '47.5%' }}
                                        />
                                        <TextField
                                            name="level_score"
                                            label="Skor"
                                            value={item.evaluations[0].level_id ? stdPrestasiLevel.find(level => level.level_id === item.evaluations[0].level_id).level_score : 'N/A'}
                                            InputProps={{ readOnly: true }}
                                            style={{ margin: '10px', width: '47.5%' }}
                                        />
                                        <Typography variant="h6">Standard Prestasi</Typography>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>TAHAP PENGUASAAN</TableCell>
                                                        <TableCell>TAFSIRAN</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {item.levels.map(level => (
                                                        <TableRow key={level.level_id}>
                                                            <TableCell component="th" scope="row">
                                                                {level.level_score}
                                                            </TableCell>
                                                            <TableCell>{level.level_desc}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                ))}
                            </Box>
                        )
                    ))}

{tabValue === subtunjang.length && (
                    <Box boxShadow={10} p="10px" m="20px">
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>
                            Ulasan Guru
                        </Typography>
                        <TextField
                            name="teacher_comment"
                            label="Ulasan Guru"
                            value={studentEvaluate.teacher_comment || ''}
                            InputProps={{ readOnly: true }}
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            style={{ margin: '10px 0', width: '85%'}}
                        />
                    </Box>
                )}
                </Box>
            )}
        </Box>
    );
};

export default ViewStudentEvaluate;
