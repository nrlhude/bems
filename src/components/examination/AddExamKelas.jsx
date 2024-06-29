// File Path: frontend/src/components/examination/AddExamKelas.jsx
// route path: /createexamkelas

import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const AddExamKelas = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // session_id, kelassession_id, term, examkelas_name
    const validationSchema = yup.object().shape({
        kelassession_id: yup.string().required("Kelas is required"),
        examkelas_name: yup.string().required("Nama Peperiksaan Kelas is required"),
        term: yup.string().required("Penggal persekolahan is required"),
    });

    const initialValues = {
        kelassession_id: '',
        examkelas_name: '',
        term: '',
    };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [kelasSession, setKelasSession] = useState([]);
    const currentsession = localStorage.getItem('schoolsessionID');

    // Fetching class sessions from API
    useEffect(() => {
        const fetchKelasSessions = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/kelas-session/');
                const filtersesi = response.data.filter(kelas => kelas.session_id === parseInt(currentsession));
                setKelasSession(filtersesi);
            } catch (error) {
                console.error('Error fetching class sessions:', error);
                setError('Error fetching data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchKelasSessions();
    }, []);

    const currentUserID = localStorage.getItem('user_id');
    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            const kelassessionRes = await axios.get(`http://127.0.0.1:8000/api/kelas-session/${values.kelassession_id}/`);
            const schoolsessionRes = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
            const schoolsession = schoolsessionRes.data.find(schoolsession => schoolsession.session_id === parseInt(kelassessionRes.data.session_id));

            const data = {
                ...values,
                session_id: schoolsession.session_id,
                created_by: currentUserID
            };
            const response = await axios.post('http://127.0.0.1:8000/api/examkelas/', data);
            console.log(response.data); // Log the response data
            alert('Exam kelas created successfully!');
            window.location.href = '/examination';
        } catch (error) {
            console.error('Error creating exam kelas:', error);
        } finally {
            setSubmitting(false);
        }
    };
    
    return (
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/examination" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Peperiksaan
                    </Link>
                    <Typography color="text.primary">Tambah Peperiksaan Kelas</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0 20px">
                <Header title="TAMBAH PEPERIKSAAN KELAS" subtitle="" />
                <Box boxShadow={15} p="10px">
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
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Box boxShadow={15} p="10px" mt="20px">
                                    {/* Select field for kelassession_id */}
                                    <TextField
                                        style={{ margin: '10px', width: '47%' }}
                                        variant="outlined"
                                        select
                                        id="kelassession_id"
                                        name="kelassession_id"
                                        label=""
                                        value={values.kelassession_id}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.kelassession_id && Boolean(errors.kelassession_id)}
                                        helperText={touched.kelassession_id && errors.kelassession_id}
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value="">Kelas</option>
                                        {/* Replace with options fetched from API */}
                                        {kelasSession.map(kelas => (
                                            <option key={kelas.kelassession_id} value={kelas.kelassession_id}>{kelas.kelassession_name}</option>
                                        ))}
                                    </TextField>

                                    {/* Term: Penggal Pertama/ Pertengahan Tahun/ Penggal Kedua/ Akhir Tahun */}
                                    <TextField
                                        style={{ margin: '10px', width: '47%' }}
                                        variant="outlined"
                                        select
                                        id="term"
                                        name="term"
                                        label="Penggal Persekolahan"
                                        value={values.term}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.term && Boolean(errors.term)}
                                        helperText={touched.term && errors.term}
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value="">Penggal Persekolahan</option>
                                        <option value="Penggal Pertama">Penggal Pertama</option>
                                        <option value="Pertengahan Tahun">Pertengahan Tahun</option>
                                        <option value="Penggal Kedua">Penggal Kedua</option>
                                        <option value="Akhir Tahun">Akhir Tahun</option>
                                    </TextField>

                                    {/* Input field for evaluate_name */}
                                    <TextField
                                        style={{ margin: '10px', width: '47%' }}
                                        variant="outlined"
                                        id="examkelas_name"
                                        name="examkelas_name"
                                        label="Nama Peperiksaan Kelas"
                                        value={values.examkelas_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.examkelas_name && Boolean(errors.examkelas_name)}
                                        helperText={`"Nama Kelas : " ${values.term}`}
                                    />

                                    {/* Submit button */}
                                    <Box display="flex" justifyContent="end" m="20px">
                                        <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                                            {isSubmitting ? 'Submitting...' : 'Submit'}
                                        </Button>
                                    </Box>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Box>
        </Box>
    );
};

export default AddExamKelas;


