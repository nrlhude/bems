// File Path : frontend/src/components/students/AssignKelasStudent.jsx
// Route Path : /students/assignkelasstudent/:studentId

import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const AssignKelasStudent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const { studentId } = useParams();

    const validationSchema = yup.object().shape({
        student_id: yup.string().required("Student is required"),
        kelassession_id: yup.string().required("Kelas is required"),
        role: yup.string().required("Role is required"),
    });

    const initialValues = {
        student_id: studentId,
        kelassession_id: "",
        role: 'PELAJAR',
    };

    const [student, setStudent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [kelasSession, setKelas] = useState([]);
    const currentsession = localStorage.getItem('schoolsessionID');

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/studentprofile/${studentId}/`);
                setStudent(response.data);
            } catch (error) {
                setError('Error fetching Student details.');
                console.error('Error fetching Student details:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchKelas = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/kelas-session/');
                const filtersesi = response.data.filter(kelas => kelas.session_id === parseInt(currentsession));
                setKelas(filtersesi);
            } catch (error) {
                console.error('Error fetching kelas data:', error);
            }
        };

        fetchStudentDetails();
        fetchKelas();
    }, [studentId]);

    console.log('student', student);
    const currentUser = localStorage.getItem('user_id');
    console.log('currentUser', currentUser);
    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            const kelasSessionResponse = await axios.get(`http://127.0.0.1:8000/api/kelas-session/${values.kelassession_id}/`);
            const sessionId = kelasSessionResponse.data.session_id;
            const parentRes = await axios.get(`http://127.0.0.1:8000/api/parentprofile/${student.parent_id}/`);
            const userId = parentRes.data.user;
            const data = {
                ...values,
                session_id: sessionId,
                created_by: currentUser,
                user_id: userId,
            };
            console.log('Assign Student data:', data);
            const response = await axios.post('http://127.0.0.1:8000/api/people-kelas/', data);
            console.log('Assign Student created:', response.data);
            alert("Assign Student created successfully!");
            window.location.href = `/viewprofilestudent/${studentId}`;
        } catch (error) {
            console.error('Error creating Assign Student:', error.response?.data || error.message);
            alert("Error creating Assign Student. Please try again later.");
        }

        setSubmitting(false);
    };

    return (
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/students" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Pelajar
                    </Link>
                    <Typography color="text.primary">Kemaskini Kelas Pelajar</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0 20px">
                <Header title="KEMASKINI PELAJAR" subtitle="" />

                <Box boxShadow={15} p="10px" mt="20px">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            setFieldValue,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    label=""
                                    name="student_id"
                                    value={student.full_name}
                                    onBlur={handleBlur}
                                    style={{ margin: '10px', width: '47.5%' }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    label="Role"
                                    name="role"
                                    value={values.role}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.role && Boolean(errors.role)}
                                    helperText={touched.role && errors.role}
                                    style={{ margin: '10px', width: '47.5%' }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    label="Kelas"
                                    name="kelassession_id"
                                    select
                                    value={values.kelassession_id}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.kelassession_id && Boolean(errors.kelassession_id)}
                                    helperText={touched.kelassession_id && errors.kelassession_id}
                                    style={{ margin: '10px', width: '47.5%' }}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">Kelas</option>
                                    {kelasSession.map(kelasSession => (
                                        <option key={kelasSession.kelassession_id} value={kelasSession.kelassession_id}>{kelasSession.kelassession_name}</option>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Status"
                                    name="status"
                                    select
                                    value={values.status}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.status && Boolean(errors.status)}
                                    helperText={touched.status && errors.status}
                                    style={{ margin: '10px', width: '47.5%' }}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                </TextField>
                                <Box display="flex" justifyContent="end" m="20px">
                                    <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Box>

        </Box>
    );
};

export default AssignKelasStudent;
