// file path: frontend/src/components/examination/UpdateExamKelas.jsx

import React, { useState, useEffect } from 'react';
import { Box, Breadcrumbs, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button } from "@mui/material";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const UpdateExamKelas = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { examkelasId } = useParams();
    const navigate = useNavigate();

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
                const studentExamsWithNames = filteredStudentExams.map(exam => {
                    const studentProfile = studentProfilesRes.data.find(student => student.id === exam.student_id);
                    return {
                        ...exam,
                        student_name: studentProfile ? studentProfile.full_name : 'N/A'
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

    const handleMarkChange = (e, studentExamId, subjectName) => {
        const { value } = e.target;
        const mark = parseInt(value); // Parse the input value as an integer
        setStudentExamScores(prevScores =>
            prevScores.map(score =>
                score.studentexam_id === studentExamId && score.subject_name === subjectName
                    ? { ...score, mark: mark, grade: determineGrade(mark) } // Update mark as integer
                    : score
            )
        );
    };
    

    const determineGrade = (mark) => {
        if (mark >= 80) return 'A';
        if (mark >= 60) return 'B';
        if (mark >= 40) return 'C';
        if (mark >= 20) return 'D';
        return 'F';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('studentExamScores in hanleSubmit', studentExamScores);
        try {
            await Promise.all(
                studentExamScores.map(score =>
                    axios.put(`http://127.0.0.1:8000/api/studentexamscore/${score.studentexamscore_id}/`, score)
                )
            );
            
            alert('Data updated successfully!');
            navigate(`/viewexamkelas/${examkelasId}`);
        } catch (error) {
            console.error('Error updating student exam scores:', error);
            alert('Error updating data. Please try again later.');
        }
    };

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

    console.log('groupedScores', groupedScores);
    console.log('studentExamScores', studentExamScores);
    return (
        <Box m={2}>
            <Breadcrumbs aria-label="breadcrumb">
                <RouterLink to="/examination">Peperiksaan</RouterLink>
                <Typography color="textPrimary">{examKelas.examkelas_name}</Typography>
            </Breadcrumbs>

            <Typography variant="h4" gutterBottom>
                Kemaskini {examKelas.examkelas_name}
            </Typography>

            <form onSubmit={handleSubmit}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell rowSpan={2}>No</TableCell>
                                <TableCell rowSpan={2}>PELAJAR</TableCell>
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
                            {studentExams.map((studentExam, index) => (
                                <TableRow key={studentExam.studentexam_id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{studentExam.student_name}</TableCell>
                                    {examSubjects.map(subject => {
                                        const score = (groupedScores[studentExam.studentexam_id] || []).find(s => s.subject_name === subject.subject_name) || {};
                                        console.log('score', score);
                                        return (
                                            <React.Fragment key={subject.subject_name}>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        value={score.mark || ''}
                                                        onChange={(e) => handleMarkChange(e, studentExam.studentexam_id, subject.subject_name)} 
                                                    />
                                                </TableCell>
                                                <TableCell>{score.grade || 'N/A'}</TableCell>
                                            </React.Fragment>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box mt={2}>
                    <Button type="submit" variant="contained" color="secondary"> Update </Button>
                </Box>
            </form>
        </Box>
    );
};

export default UpdateExamKelas;
