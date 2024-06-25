// frontend/src/components/kelasSession/AddKelasSession.jsx

import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';    
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const AddKelasSession = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Use useHistory to redirect user to another page
    const history = useNavigate();

    // State to store session data
    const [sessions, setSessions] = useState([]);

    // State to store kelas data
    const [kelas, setKelas] = useState([]);

    // Fetch session data and kelas data when the component mounts
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
                setSessions(response.data);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        const fetchKelass = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/kelass/');
                setKelas(response.data);
            } catch (error) {
                console.error('Error fetching kelas:', error);
            }
        };

        fetchSessions();
        fetchKelass();
    }, []);

    const validationSchema = yup.object({
        session_id: yup.string().required("Session is required"),
        kelas_id: yup.string().required("Kelas is required"),
    });

    const initialValues = {
        session_id: "",
        kelas_id: "",
        kelassession_name: "",
        num_teacher: 0,
        num_student: 0,
    };
    
    // Handle form submission
    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
        const response = await axios.post('http://127.0.0.1:8000/api/kelas-session/', values);
        console.log(response.data);
        alert("Kelas Session created successfully!");
        history('/kelasSession');
        } catch (error) {
        console.error('Error creating Kelas Session:', error);
        alert("Error creating Kelas Session. Please try again later.");
        }
        setSubmitting(false);
    };

    return (
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/kelasSession" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Kelas
                    </Link>
                    <Typography color="text.primary">Tambah Kelas</Typography>
                </Breadcrumbs>
            </Box>
            <Box m="10px 0 0 20px"> 
            <Header 
                title="KELAS" 
                subtitle="Senarai kelas di APCPJ" 
            /> 
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
                                setFieldValue,
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <Box
                                        display="grid"
                                        gap="10px"
                                        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                            
                                    >
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        select
                                        id="kelas_id"
                                        name="kelas_id"
                                        label="Nama Kelas"
                                        value={values.kelas_id}
                                        margin="normal"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.kelas_id && Boolean(errors.kelas_id)}
                                        helperText={touched.kelas_id && errors.kelas_id}
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value="">Select</option>
                                        {kelas.map(kelas => (
                                            <option key={kelas.kelas_id} value={kelas.kelas_id}>{kelas.kelas_name}</option>
                                        ))}
                                    </TextField>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        select
                                        id="session_id"
                                        name="session_id"
                                        label="Sesi Persekolahan"
                                        value={values.session_id}
                                        margin="normal"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.session_id && Boolean(errors.session_id)}
                                        helperText={touched.session_id && errors.session_id}
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value="">Select</option>
                                        {/* Fetch session data from the database */}
                                        {sessions.map(session => (
                                            <option key={session.session_id} value={session.session_id}>{session.session_name}</option>
                                        ))}
                                    </TextField>
                                    {/* kelassession_name : default kelas_name + session_name */}
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        label="Nama Kelas"
                                        id="kelassession_name"
                                        name="kelassession_name"
                                        value={values.kelassession_name}
                                        margin="normal"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.kelassession_name && Boolean(errors.kelassession_name)}
                                        helperText={touched.kelassession_name && errors.kelassession_name}
                                        // sx={{ gridColumn: "span 2" }}
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

export default AddKelasSession;


