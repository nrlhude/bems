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

const AddEvaluateKelas = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Validation schema using Yup
    const validationSchema = yup.object().shape({
        kelassession_id: yup.string().required("Kelas is required"),
        evaluate_name: yup.string().required("Nama Penilaian is required"),
        evaluate_date: yup.string().required("Tarikh Penilaian is required"),
    });

    // Initial values for the form fields
    const initialValues = {
        kelassession_id: "",
        evaluate_name: "",
        evaluate_date: "",
        kelassession_name: "",
    };

    // State for loading data and error handling
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

            console.log('Kelas Session:', kelassessionRes.data);
            console.log('School Session:', schoolsession);
            console.log('Evaluation Kelas Data:', values);
            console.log('Current User ID:', currentUserID);
           
            const data = {
                ...values,
                session_id: schoolsession.session_id,
                created_by: currentUserID
            };
            
            const response = await axios.post('http://127.0.0.1:8000/api/evaluate-kelas/', data);
            const createdEvaluateKelasId = response.data.evaluate_id;
            console.log('Evaluation Kelas created:', data);
            alert('Evaluation Kelas created successfully!');
            window.location.href = `/viewevaluatekelas/${createdEvaluateKelasId}`;
        } catch (error) {
            console.error('Error creating Evaluation Kelas:', error.response?.data || error.message);
            alert("Error creating Evaluation Kelas. Please try again later.");
        }
        setSubmitting(false);
    }

    return (
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/evaluation" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Penilaian
                    </Link>
                    <Typography color="text.primary">Tambah Penilaian Kelas</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0 20px">
                <Header title="TAMBAH PENILAIAN KELAS" subtitle="" />
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

                                    {/* Date field for evaluate_date */}
                                    <TextField
                                        style={{ margin: '10px', width: '47%' }}
                                        variant="outlined"
                                        id="evaluate_date"
                                        name="evaluate_date"
                                        label="Tarikh Penilaian"
                                        type="date"
                                        value={values.evaluate_date}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.evaluate_date && Boolean(errors.evaluate_date)}
                                        helperText={touched.evaluate_date && errors.evaluate_date}
                                    />

                                    {/* Input field for evaluate_name */}
                                    <TextField
                                        style={{ margin: '10px', width: '47%' }}
                                        variant="outlined"
                                        id="evaluate_name"
                                        name="evaluate_name"
                                        label="Nama Penilaian"
                                        value={values.evaluate_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.evaluate_name && Boolean(errors.evaluate_name)}
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

export default AddEvaluateKelas;
