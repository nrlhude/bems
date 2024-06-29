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

const AddAttendanceKelas = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { input_date } = useParams();

    const validationSchema = yup.object().shape({
        kelassession_id: yup.string().required("Kelas is required"),
        attendance_name: yup.string().required("Attendance Name is required"),
        attendance_date: yup.string().required("Attendance Date is required"),
    });

    const initialValues = {
        kelassession_id: "",
        attendance_name: "",
        attendance_date: input_date,
    };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [kelasSession, setKelas] = useState([]);

    const currentsession = localStorage.getItem('schoolsessionID');
    useEffect(() => {
        const fetchKelas = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/kelas-session/');
                const filtersesi = response.data.filter(kelas => kelas.session_id === parseInt(currentsession));
                setKelas(filtersesi);
            } catch (error) {
                console.error('Error fetching kelas data:', error);
            }
        };

        fetchKelas();
    }, []);

    const currentUser = localStorage.getItem('user_id');
    const handleFormSubmit = async (values, { setSubmitting }) => {
        
        try {
            const data = {
                ...values,
                created_by: currentUser,
            };
            const response = await axios.post('http://127.0.0.1:8000/api/attendance-kelas/', data);
            const createdAttendanceKelasId = response.data.attendance_id;
            console.log('Attendance Kelas created:', data);
            alert('Attendance Kelas created successfully!');
            window.location.href = `/viewattendancekelas/${createdAttendanceKelasId}`;
        }
        catch (error) {
            console.error('Error creating Attendance Kelas:', error.response?.data || error.message);
            alert("Error creating Attendance Kelas. Please try again later.");
        }
        setSubmitting(false);
    }

    return (
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/rph" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Kehadiran
                    </Link>
                    <Typography color="text.primary">Tambah Kehadiran Kelas</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0 20px">
                <Header title="TAMBAH KEHADIRAN" subtitle="" />
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
                            <Box
                                display="grid"
                                gap="10px"
                                gridTemplateColumns="repeat(1, minmax(0, 1fr))"
                            >
                                {/* Select field for kelassession_id */}
                                <TextField
                                    fullWidth
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
                                    {kelasSession.map(kelasSession => (
                                        <option key={kelasSession.kelassession_id} value={kelasSession.kelassession_id}>{kelasSession.kelassession_name}</option>
                                    ))}
                                </TextField>

                                {/* Date field for attendance_date */}
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    id="attendance_date"
                                    name="attendance_date"
                                    label="Attendance Date"
                                    type="date"
                                    value={values.attendance_date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.attendance_date && Boolean(errors.attendance_date)}
                                    helperText={touched.attendance_date && errors.attendance_date}
                                />

                                {/* Input field for attendance_name */}
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    id="attendance_name"
                                    name="attendance_name"
                                    label="Nama Kehadiran"
                                    value={values.attendance_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.attendance_name && Boolean(errors.attendance_name)}
                                    helperText={touched.attendance_name && errors.attendance_name}
                                />

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

export default AddAttendanceKelas;