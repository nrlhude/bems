import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, CircularProgress, Breadcrumbs } from "@mui/material";
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from "../Header";
import { useNavigate } from 'react-router-dom';

const AddClassReport = () => {
    const navigate = useNavigate();
    const [kelasEnrolment, setKelasEnrolment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [schoolSession, setSchoolSession] = useState([]);
    
    const currentsession = localStorage.getItem('schoolsessionID');
    useEffect(() => {
        const fetchKelas = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/kelas-session/');
                const filtersesi = response.data.filter(kelas => kelas.session_id === parseInt(currentsession));
                setKelasEnrolment(filtersesi);
                setLoading(false);
            } catch (error) {
                setError('Error fetching kelas data');
                setLoading(false);
            }
        };
        const fetchSchoolSession = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
                setSchoolSession(response.data);
            } catch (error) {
                console.error('Error fetching school session data:', error);
            }
        };
        fetchKelas();
        fetchSchoolSession();
        document.title = 'Tambah Laporan Kelas';
    }, []);

    const validationSchema = yup.object().shape({
        tarikh: yup.date().required("Tarikh is required"),
        masa: yup.string().required("Masa is required"),
        kehadiran_murid: yup.string().required("Kehadiran Murid is required"),
        kelas: yup.string().required("Kelas is required"),
        tajuk: yup.string().required("Tajuk is required"),
        tema: yup.string().required("Tema is required"),
        session_id: yup.string().required("Sesi Persekolahan is required"),
    });

    const initialValues = {
        tarikh: '',
        masa: '',
        kehadiran_murid: '',
        kelas: '',
        tajuk: '',
        tema: '',
        ulasan_keseluruhan: '',
        cadangan_penambahbaikan: '',
        created_by: '',
        session_id: '',
    };

    const currentUser = localStorage.getItem('user_id');
    const handleFormSubmit = async (values, { setSubmitting }) => {
        const data = {
            ...values,
            created_by: currentUser,
        };
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/report-class/', data);
            console.log(response.data);
            alert('Class report created successfully!');
            navigate('/reportClass');
        } catch (error) {
            console.error('Error creating class report:', error);
            alert('Error creating class report. Please try again later.');
        }
        setSubmitting(false);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box>
            <Box m="10px 0 10px 20px">
                <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to="/reportClass" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Laporan Kelas
                </Link>
                <Typography color="text.primary">Tambah Laporan Kelas</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0 20px">
                <Header title="TAMBAH LAPORAN KELAS" subtitle="" />
                
                <Box boxShadow={10} p="10px" mt="20px">
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
                            setTextFieldValue,
                        }) => (
                        <form onSubmit={handleSubmit}>
                            <Box>
                                <TextField
                                    label="Tarikh"
                                    type='date'
                                    name="tarikh"
                                    value={values.tarikh}
                                    error={touched.tarikh && Boolean(errors.tarikh)}
                                    helperText={touched.tarikh && errors.tarikh}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{ margin: '10px', width: '20%' }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    
                                    label="Masa"
                                    name="masa"
                                    type='time'
                                    value={values.masa}
                                    error={touched.masa && Boolean(errors.masa)}
                                    helperText={touched.masa && errors.masa}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{ margin: '10px', width: '20%' }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    
                                    label="Kehadiran Murid"
                                    name="kehadiran_murid"
                                    value={values.kehadiran_murid}
                                    error={touched.kehadiran_murid && Boolean(errors.kehadiran_murid)}
                                    helperText={touched.kehadiran_murid && errors.kehadiran_murid}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    style={{ margin: '10px', width: '10%' }}
                                />
                                <TextField
                                    label="Kelas"
                                    name="kelas" 
                                    select
                                    value={values.kelas}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.kelas && Boolean(errors.kelas)}
                                    helperText={touched.kelas && errors.kelas}
                                    SelectProps={{ native: true }}
                                    style={{ margin: '10px', width: '20%' }}
                                >
                                    <option value="">Kelas</option>
                                    {kelasEnrolment.map(kelas => (
                                        <option key={kelas.kelassession_id} value={kelas.kelassession_name}>{kelas.kelassession_name}</option>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Sesi Persekolahan"
                                    name="session_id" 
                                    select
                                    value={values.session_id}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.session_id && Boolean(errors.session_id)}
                                    helperText={touched.session_id && errors.session_id}
                                    style={{ margin: '10px', width: '20%' }}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">Sesi Persekolahan</option>
                                    {schoolSession.map(sesi => (
                                        <option key={sesi.session_id} value={sesi.session_id}>{sesi.session_name}</option>
                                    ))}
                                </TextField>
                                <TextField
                                    
                                    label="Tajuk"
                                    name="tajuk"
                                    value={values.tajuk}
                                    error={touched.tajuk && Boolean(errors.tajuk)}
                                    helperText={touched.tajuk && errors.tajuk}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{ margin: '10px', width: '47.5%' }}
                                />
                                <TextField
                                    label="Tema"
                                    name="tema"
                                    value={values.tema}
                                    error={touched.tema && Boolean(errors.tema)}
                                    helperText={touched.tema && errors.tema}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{ margin: '10px', width: '48%' }}
                                />
                                <TextField
                                    label="Ulasan Keseluruhan"
                                    name="ulasan_keseluruhan"
                                    value={values.ulasan_keseluruhan}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.ulasan_keseluruhan && Boolean(errors.ulasan_keseluruhan)}
                                    helperText={touched.ulasan_keseluruhan && errors.ulasan_keseluruhan}
                                    style={{ margin: '10px' , width: '97%' }}
                                />
                                <TextField
                                    label="Cadangan Penambahbaikan"
                                    name="cadangan_penambahbaikan"
                                    value={values.cadangan_penambahbaikan}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.cadangan_penambahbaikan && Boolean(errors.cadangan_penambahbaikan)}
                                    helperText={touched.cadangan_penambahbaikan && errors.cadangan_penambahbaikan}
                                    style={{ margin: '10px' , width: '97%' }}
                                />
                                
                            </Box>

                            <Box display="flex" justifyContent="flex-end" mt="20px">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
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

export default AddClassReport;
