// route: /assignkelasteacher/${teacherId}
// <Route path="/assignkelasteacher/:teacherId" element={<AssignKelasTeacher />} />
// Path: frontend/src/components/teachers/AssignKelasTeacher.jsx

import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink, useParams} from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';  
import { tokens } from "../../theme";  
import { useTheme } from "@mui/material";   


const AssignKelasTeacher = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const { teacherId } = useParams();

    const validationSchema = yup.object().shape({
        teacher_id: yup.date().required("Guru is required"),
        kelassession_id: yup.string().required("Kelas is required"),
        role: yup.string().required("Role is required"),
    });

    const initialValues = {
        teacher_id: teacherId,
        kelassession_id: "",
        role: 'GURU',
    };
    const [teacher, setTeacher] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [kelasSession, setKelas] = useState([]);

    useEffect(() => {
        const fetchTeacherDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/teacherprofile/${teacherId}/`);
                setTeacher(response.data);
            } catch (error) {
                setError('Error fetching Teacher details.');
                console.error('Error fetching Teacher details:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchKelas = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/kelas-session/');
                setKelas(response.data);
            } catch (error) {
                console.error('Error fetching kelas data:', error);
            }
        };

        fetchTeacherDetails();
        fetchKelas();
    }, [teacherId]);

    const handleFormSubmit = async (values, { setSubmitting }) => {
        const data = {
            ...values,
        };
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/people-kelas/', data);
            console.log('Assign Teacher created:', response.data);
            alert("Assign Teacher created successfully!");
            window.location.href = `/viewprofileteacher/${teacherId}`;
        } catch (error) {
            console.error('Error creating Assign Teacher:', error.response?.data || error.message);
            alert("Error creating Assign Teacher. Please try again later.");
        }
        setSubmitting(false);
    };

    return (
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/teachers" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Guru
                    </Link>
                    <Typography color="text.primary">Kemaskini Kelas Guru</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0 20px">
                <Header title="KEMASKINI GURU" subtitle="" />

                {/* Update in TeacherProfile, but add new into PeopleKelas class
                form fields is teacher_id, kelassession_id from class KelasSession
                  */}

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
                                    name="teacher_id"
                                    value={teacher.full_name}
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

export default AssignKelasTeacher;