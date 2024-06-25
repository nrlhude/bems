// file path : frontend/src/components/reportStudent/ReportStudentDetails.jsx
// route path : /reportStudent/:studentId/:kelassessionId

import React, { useState, useEffect } from 'react';
import { Box, Breadcrumbs, Typography, TextField, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';

const ReportStudentDetails = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { studentId, kelassessionId } = useParams();

    const [loading, setLoading] = useState(true);
    const [studentProfile, setStudentProfile] = useState({});
    const [stdPrestasiEvaluation, setStdPrestasiEvaluation] = useState([]);
    const [stdPrestasiCriteria, setStdPrestasiCriteria] = useState([]);
    const [stdPrestasiLevel, setStdPrestasiLevel] = useState([]);
    const [subtunjang, setSubtunjang] = useState([]);
    const [studentReportEvaluation, setStudentReportEvaluation] = useState([]);
    const [studentEvaluate, setStudentEvaluate] = useState([]);

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    studentProfileRes,
                    stdPrestasiEvaluationRes,
                    stdPrestasiCriteriaRes,
                    stdPrestasiLevelRes,
                    subtunjangRes,
                    studentReportEvaluationRes,
                    studentEvaluateRes,
                ] = await Promise.all([
                    axios.get(`http://127.0.0.1:8000/api/studentprofile/${studentId}/`),
                    axios.get('http://127.0.0.1:8000/api/stdprestasievaluation/'),
                    axios.get('http://127.0.0.1:8000/api/stdprestasicriteria/'),
                    axios.get('http://127.0.0.1:8000/api/stdprestasilevel/'),
                    axios.get('http://127.0.0.1:8000/api/sub-tunjang/'),
                    axios.get('http://127.0.0.1:8000/api/studentreportevaluation/'),
                    axios.get('http://127.0.0.1:8000/api/student-evaluate/')
                ]);

                setStudentProfile(studentProfileRes.data);
                setStdPrestasiEvaluation(stdPrestasiEvaluationRes.data);
                setStdPrestasiCriteria(stdPrestasiCriteriaRes.data);
                setStdPrestasiLevel(stdPrestasiLevelRes.data);
                setSubtunjang(subtunjangRes.data);
                setStudentReportEvaluation(studentReportEvaluationRes.data);
                setStudentEvaluate(studentEvaluateRes.data);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId, kelassessionId]);



    const getScoreForTerm = (criId, term) => {
        const evaluation = stdPrestasiEvaluation.find(evaluation => evaluation.cri_id === criId && evaluation.term === term && evaluation.student_id === parseInt(studentId) && evaluation.kelassession_id === parseInt(kelassessionId));
        if (evaluation) {
            const level = stdPrestasiLevel.find(level => level.level_id === evaluation.level_id);
            return level ? level.level_score : 'N/A';
        }
        console.log('evaluation in getScoreForTerm:', evaluation);
        return 'N/A';
    };
    
    

    // console.log('studentProfile:', studentProfile);
    // console.log('stdPrestasiEvaluation:', stdPrestasiEvaluation);
    // console.log('stdPrestasiCriteria:', stdPrestasiCriteria);
    // console.log('stdPrestasiLevel:', stdPrestasiLevel);
    // console.log('subtunjang:', subtunjang);
    console.log('studentReportEvaluation 2:', studentReportEvaluation);
    // console.log('studentEvaluate:', studentEvaluate);

    // Function to filter studentEvaluate based on studentReportEvaluation's studentevaluate_id
    const filterStudentEvaluate = () => {
        // Filter studentReportEvaluation for entries related to the given studentId 
        const filteredStudentReportEvaluation = studentReportEvaluation.filter(report => report.student_id === parseInt(studentId) && report.kelassession_id === parseInt(kelassessionId));
        console.log('filteredStudentReportEvaluation:', filteredStudentReportEvaluation);

        // Extract studentevaluate_id values from filtered studentReportEvaluation
        const studentevaluateIds = filteredStudentReportEvaluation.map(report => report.studentevaluate_id);

        // Filter studentEvaluate based on studentevaluateIds, sort by termOrder
        const filteredStudentEvaluate = studentEvaluate.filter(evaluate =>
            studentevaluateIds.includes(evaluate.studentevaluate_id)
        );

        // Sort filteredStudentEvaluate by term order
        const termOrder = ["Penggal Pertama", "Pertengahan Tahun", "Penggal Kedua", "Akhir Tahun"];
        filteredStudentEvaluate.sort((a, b) => termOrder.indexOf(a.term) - termOrder.indexOf(b.term));

        console.log('filteredStudentEvaluate:', filteredStudentEvaluate);
        return filteredStudentEvaluate;
    };

    const filteredStudentEvaluate = filterStudentEvaluate();

    return (
        <Box>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <Box>
                    <Box m="10px 0 0 20px">
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                component={RouterLink}
                                to="/reportStudent"
                                color="text.primary"
                                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Laporan Pelajar
                            </Link>
                            <Typography color="text.primary">Butiran Laporan Pelajar</Typography>
                        </Breadcrumbs>
                    </Box>

                    <Box m="0 0 0 20px">
                        <Header title="BUTIRAN LAPORAN PELAJAR" subtitle="" />
                    </Box>

                    <Box boxShadow={10} m="20px 1px">
                        <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
                            <Tab label="Maklumat Pelajar" />
                            {subtunjang.map((subTunjang, index) => (
                                <Tab key={index} label={subTunjang.subtunjang_name} />
                            ))}
                            <Tab label="Ulasan Guru" />
                        </Tabs>
                    </Box>

                    {tabValue === 0 && (
                        <Box boxShadow={10} p="10px" m="20px">
                            <Typography variant="h5" color={colors.greenAccent[400]} gutterBottom>
                                MAKLUMAT PELAJAR
                            </Typography>
                                <Box boxShadow={10} p="10px" m="20px">
                                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Maklumat Peribadi</Typography>
                                <TextField
                                    name="full_name"
                                    label="Nama Pelajar"
                                    value={studentProfile.full_name || ''}
                                    InputProps={{ readOnly: true }}
                                    style={{ margin: '10px', width: '97%' }}
                                />
                            </Box>
                        </Box>
                    )}

                    {subtunjang.map((subTunjang, index) => (
                        tabValue === index + 1 && (
                            <Box key={subTunjang.subtunjang_id} boxShadow={10} p="10px" m="20px">
                                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>
                                    {subTunjang.subtunjang_name}
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Kod</TableCell>
                                                <TableCell>Konstruk</TableCell>
                                                <TableCell>Penggal Pertama</TableCell>
                                                <TableCell>Pertengahan Tahun</TableCell>
                                                <TableCell>Penggal Kedua</TableCell>
                                                <TableCell>Akhir Tahun</TableCell>
                                                <TableCell><b>Standard Prestasi</b></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stdPrestasiCriteria.filter(cri => cri.subtunjang_id === subTunjang.subtunjang_id).map(cri => {
                                                const levels = stdPrestasiLevel.filter(level => level.cri_id === cri.cri_id);
                                                return (
                                                    <TableRow key={cri.cri_id}>
                                                        <TableCell>{cri.cri_code}</TableCell>
                                                        <TableCell>{cri.cri_desc}</TableCell>
                                                        <TableCell>{getScoreForTerm(cri.cri_id, 'Penggal Pertama')}</TableCell>
                                                        <TableCell>{getScoreForTerm(cri.cri_id, 'Pertengahan Tahun')}</TableCell>
                                                        <TableCell>{getScoreForTerm(cri.cri_id, 'Penggal Kedua')}</TableCell>
                                                        <TableCell>{getScoreForTerm(cri.cri_id, 'Akhir Tahun')}</TableCell>
                                                        <TableCell>
                                                            <Table size="small" aria-label="standard prestasi">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Skor</TableCell>
                                                                        <TableCell>Tafsiran</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {levels.map(level => (
                                                                        <TableRow key={level.level_id}>
                                                                            <TableCell>{level.level_score}</TableCell>
                                                                            <TableCell>{level.level_desc}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )
                    ))}

            {tabValue === subtunjang.length + 1 && (
                <Box boxShadow={10} p="10px" m="20px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>
                        Ulasan Guru
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Penggal</TableCell>
                                    <TableCell>Komen Guru</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* const termOrder = ["Penggal Pertama", "Pertengahan Tahun", "Penggal Kedua", "Akhir Tahun"]; order by the term */}
                                {filteredStudentEvaluate.map(evaluate => (
                                    <TableRow key={evaluate.studentevaluate_id}>
                                        <TableCell>{evaluate.term}</TableCell>
                                        <TableCell>{evaluate.teacher_comment}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}


                </Box>
            )}
        </Box>
    );
};

export default ReportStudentDetails;
