// `/viewstudentexam/${params.row.student_id}/${params.row.kelassession_id}`
// Path: frontend/src/components/examination/ViewStudentExam.jsx

import { Box, Button, Breadcrumbs, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Link } from "@mui/material";
import { Link as RouterLink, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import Header from '../../components/Header';

const ViewStudentExam = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { studentId, kelassessionId } = useParams();
    console.log('studentId', studentId, 'kelasSessionId', kelassessionId);

    const [studentExams, setStudentExams] = useState([]);
    const [examSubjects, setExamSubjects] = useState([]);
    const [studentExamScores, setStudentExamScores] = useState([]);
    const [studentProfiles, setStudentProfiles] = useState([]);
    const [kelassession, setKelasSession] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentExamsRes, examSubjectsRes, studentExamScoresRes, studentProfilesRes, examkelasRes, kelassessionRes, schoolsessionRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/studentexam/'),
                    axios.get('http://127.0.0.1:8000/api/examsubject/'),
                    axios.get('http://127.0.0.1:8000/api/studentexamscore/'),
                    axios.get(`http://127.0.0.1:8000/api/studentprofile/${studentId}/`),
                    axios.get('http://127.0.0.1:8000/api/examkelas/'),
                    axios.get(`http://127.0.0.1:8000/api/kelas-session/${kelassessionId}/`),
                    axios.get('http://127.0.0.1:8000/api/school-sessions/')
                ]);

                // status examkelas_id is 'RELEASED' and the kelassession
                const filteredExamKelas = examkelasRes.data.filter(exam => exam.status === 'RELEASED' && exam.kelassession_id === parseInt(kelassessionId));

                const filteredStudentExams = studentExamsRes.data.filter(exam => filteredExamKelas.some(filteredkelas => exam.examkelas_id === parseInt(filteredkelas.examkelas_id)) && exam.student_id === parseInt(studentId));
                
                // filter student exam scores by some filteredstudentexams.studentexam_id
                const filteredStudentExamScores = studentExamScoresRes.data.filter(score => filteredStudentExams.some(filteredstudent => score.studentexam_id === parseInt(filteredstudent.studentexam_id) ));

                setExamSubjects(examSubjectsRes.data);
                setStudentProfiles(studentProfilesRes.data);
                setKelasSession(kelassessionRes.data);
                setStudentExams(filteredStudentExams);
                setStudentExamScores(filteredStudentExamScores);
            }
            catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId, kelassessionId]);

    if (loading) { return <Typography>Loading...</Typography>; }

    if (error) { return <Typography>{error}</Typography>; }

    console.log('studentExams', studentExams);
    console.log('studentExamScores', studentExamScores);
    console.log('studentProfiles', studentProfiles);
    console.log('kelassession', kelassession);
    console.log('examSubjects', examSubjects);

    const termOrder = ["Penggal Pertama", "Pertengahan Tahun", "Penggal Kedua", "Akhir Tahun"];
 
    
    return (
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/reportStudent" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }} > Laporan Pelajar</Link>
                    <Typography color="text.primary">Keputusan Peperiksaan</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0 20px">
                <Header title="KEPUTUSAN PEPERIKSAAN" subtitle="" />
            </Box>
            <Box boxShadow={10} m="20px 10px" p={2}>
                <Typography variant="h6" style={{ margin: '20px' }}>Maklumat Pelajar</Typography>
                <TextField label="Nama Pelajar" value={studentProfiles.full_name} InputProps={{ readOnly: true, }} style={{ margin: '0 20px' , width: '20%'}} />
                <TextField label="No. Kad Pengenalan" value={studentProfiles.ic_number} InputProps={{ readOnly: true }} style={{ margin: '0 20px' , width: '20%'}} />
                <TextField label="Kelas" value={kelassession.kelassession_name} InputProps={{ readOnly: true }} style={{ margin: '0 20px' , width: '20%'}} />
            </Box>
            <Box boxShadow={10} m="20px" p={2}>
            <TableContainer component={Paper} style={{ margin: '10px' }}>
                <Table>
                    <TableHead>
                    <TableRow>
                            <TableCell>Exam Subject</TableCell>
                            <TableCell align="center" colSpan={2}>Penggal Pertama</TableCell>
                            <TableCell align="center" colSpan={2}>Pertengahan Tahun</TableCell>
                            <TableCell align="center" colSpan={2}>Penggal Kedua</TableCell>
                            <TableCell align="center" colSpan={2}>Akhir Tahun</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Markah</TableCell>
                            <TableCell>Gred</TableCell>
                            <TableCell>Markah</TableCell>
                            <TableCell>Gred</TableCell>
                            <TableCell>Markah</TableCell>
                            <TableCell>Gred</TableCell>
                            <TableCell>Markah</TableCell>
                            <TableCell>Gred</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {examSubjects.map(subject => (
                            <TableRow key={subject.subject_name}>
                                <TableCell>{subject.subject_name}</TableCell>
                                {termOrder.map((term, index) => {
                                    const studentExamScore = studentExamScores.find(score => score.term === term && score.subject_name === subject.subject_name);
                                    return (
                                        <React.Fragment key={term}>
                                            <TableCell>{studentExamScore ? studentExamScore.mark : '-'}</TableCell>
                                            <TableCell>{studentExamScore ? studentExamScore.grade : '-'}</TableCell>
                                        </React.Fragment>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                    
                </Table>
            </TableContainer>
            </Box>
        </Box>
    );
};
export default ViewStudentExam;



