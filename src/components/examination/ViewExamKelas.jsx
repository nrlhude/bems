// file path: frontend/src/components/examination/ViewExamKelas.jsx
// `/viewexamkelas/${examkelas_id}`

import { Box, Button, Breadcrumbs, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { Link as RouterLink, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const ViewExamKelas = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { examkelasId } = useParams();

    const [examKelas, setExamKelas] = useState({});
    const [studentExams, setStudentExams] = useState([]);
    const [examSubjects, setExamSubjects] = useState([]);
    const [studentExamScores, setStudentExamScores] = useState([]);
    const [studentProfiles, setStudentProfiles] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [examKelasRes, studentExamsRes, examSubjectsRes, studentExamScoresRes, studentProfilesRes] = await Promise.all([
                    axios.get(`http://127.0.0.1:8000/api/examkelas/${examkelasId}/`),
                    axios.get('http://127.0.0.1:8000/api/studentexam/'),
                    axios.get('http://127.0.0.1:8000/api/examsubject/'),
                    axios.get('http://127.0.0.1:8000/api/studentexamscore/'),
                    axios.get('http://127.0.0.1:8000/api/studentprofile/')
                ]);

                const filteredStudentExams = studentExamsRes.data.filter(exam => exam.examkelas_id === parseInt(examkelasId));

                // Map student profiles to student exams
                const studentExamsWithNames = filteredStudentExams.map((exam, index) => {
                    const studentProfile = studentProfilesRes.data.find(student => student.id === exam.student_id);
                    return {
                        ...exam,
                        student_name: studentProfile ? studentProfile.full_name : 'N/A',
                        index: index + 1
                    };
                });

                setExamKelas(examKelasRes.data);
                setStudentExams(studentExamsWithNames);
                setExamSubjects(examSubjectsRes.data);
                setStudentExamScores(studentExamScoresRes.data);
                setStudentProfiles(studentProfilesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [examkelasId]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>{error}</Typography>;
    }

    // Group student exams scores by studentexam_id
    const groupedScores = studentExamScores.reduce((acc, score) => {
        if (!acc[score.studentexam_id]) {
            acc[score.studentexam_id] = [];
        }
        acc[score.studentexam_id].push(score);
        return acc;
    }, {});

    const handleUpdateExamKelas = (examkelasId) => {
        window.location.href = `/updateexamkelas/${examkelasId}`;
    }

    const handleReleaseExamKelas = async (examkelasId) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/examkelas/${examkelasId}/`, { 
                status: 'RELEASED',
                session_id: examKelas.session_id,
                kelassession_id: examKelas.kelassession_id,
                term: examKelas.term,
                examkelas_name: examKelas.examkelas_name,
                created_by: examKelas.created_by,
                created_at: examKelas.created_at,
                updated_at: new Date().toISOString()
             });
            console.log(response.data); // Log the response data
            alert('Exam kelas released successfully!');
            window.location.reload();
        }
        catch (error) {
            console.error('Error releasing exam kelas:', error);
            alert('Error releasing exam kelas. Please try again later.');
        }
    }

    return (
        <Box m={2}>
            <Breadcrumbs aria-label="breadcrumb">
                <RouterLink to="/examination">Peperiksaan</RouterLink>
                <Typography color="textPrimary">{examKelas.examkelas_name}</Typography>
            </Breadcrumbs>

            <Typography variant="h4" gutterBottom>
                {examKelas.examkelas_name}
            </Typography>

        <Box boxShadow={10} m={2} p={2}>
            <Box display="flex" justifyContent="begin" m="10px">
                <TextField label="Penggal Peperiksaan" value={examKelas.term} InputProps={{ readOnly: true }} sx={{ margin: "10px", width:'20%' }} />
                <TextField label="Status" value={examKelas.status} InputProps={{ readOnly: true }} sx={{ margin: "10px", width:'20%' }} />
                <Button  type="submit" variant="contained" color="secondary" onClick={() => handleUpdateExamKelas(examKelas.examkelas_id)} sx={{ margin: "10px" }} >
                    UPDATE
                </Button>
                <Button  type="submit" variant="contained" color="secondary" onClick={() => handleReleaseExamKelas(examKelas.examkelas_id)} sx={{ margin: "10px" }} >
                    Release
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell rowSpan={2}>No</TableCell>
                            <TableCell rowSpan={2}>NAMA PELAJAR</TableCell>
                            {examSubjects.map(subject => (
                                <TableCell key={subject.subject_name} colSpan={2} align="center">{subject.subject_name}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            {examSubjects.map(subject => (
                                <React.Fragment key={subject.subject_name}>
                                    <TableCell>Markah</TableCell>
                                    <TableCell>Gred</TableCell>
                                </React.Fragment>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentExams.map(studentExam => (
                            <TableRow key={studentExam.studentexam_id}>
                                <TableCell>{studentExam.index}</TableCell>
                                <TableCell>{studentExam.student_name}</TableCell>
                                {examSubjects.map(subject => {
                                    const score = (groupedScores[studentExam.studentexam_id] || []).find(s => s.subject_name === subject.subject_name) || {};
                                    return (
                                        <React.Fragment key={subject.subject_name}>
                                            <TableCell>{score.mark || 'N/A'}</TableCell>
                                            <TableCell>{score.grade || 'N/A'}</TableCell>
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

export default ViewExamKelas;
