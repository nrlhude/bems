// frontend/src/components/Add/AddClass.jsx

import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

const AddClass = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    
    // Use useHistory to redirect user to another page
    const history = useNavigate();

    // State to store session data
    const [sessions, setSessions] = useState([]);

     // State to store teachers
     const [teachers, setTeachers] = useState([]);

    // Fetch session data when the component mounts
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
                setSessions(response.data);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        const fetchTeachers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/teacher/');
                setTeachers(response.data);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };

        fetchSessions();
        fetchTeachers();
    }, []);
    
    // Define validation schema for form fields
    const validationSchema = yup.object().shape({
        kelas_name: yup.string().required("Class name is required"),
        kelas_code: yup.string().required("Class code is required"),
        kelas_status: yup.string().required("Class status is required"),
        // session_id: yup.string().required("Session ID is required"),
        // kelas_desc: yup.string().required("Class description is required"),
    });
    
    // Initial values for form fields
    const initialValues = {
        kelas_name: "",
        kelas_code: "",
        kelas_desc: null,
        kelas_status: "",
        session_id: null,
        created_by: null,
    };
    
    // Handle form submission
    const handleFormSubmit = async (values, { setSubmitting }) => {
        // Convert empty strings to null
        const data = {
            ...values,
            kelas_desc: values.kelas_desc || null,
            session_id: values.session_id || null,
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/kelass/', data);
            console.log(response.data);
            alert("Class created successfully!");
            history('/settings/classes');
        } catch (error) {
            console.error('Error creating class:', error.response?.data || error.message);
            alert("Error creating class. Please try again later.");
        }
        setSubmitting(false);
    };

    return (
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/settings/classes" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Settings
                    </Link>
                    <Typography color="text.primary">Kelas</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0px 20px">
                <Header title="KELAS" subtitle="Tambah Kelas Baru" />
                <Box boxShadow={15} p="10px" mt="20px">
                    {/* Formik form */}
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
                                {/* Class Name */}
                                <TextField
                                    fullWidth
                                    id="kelas_name"
                                    name="kelas_name"
                                    label="Class Name"
                                    value={values.kelas_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.kelas_name && Boolean(errors.kelas_name)}
                                    helperText={touched.kelas_name && errors.kelas_name}
                                    variant="outlined"
                                    margin="normal"
                                />

                                {/* Class Code */}
                                <TextField
                                    fullWidth
                                    id="kelas_code"
                                    name="kelas_code"
                                    label="Class Code"
                                    value={values.kelas_code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.kelas_code && Boolean(errors.kelas_code)}
                                    helperText={touched.kelas_code && errors.kelas_code}
                                    variant="outlined"
                                    margin="normal"
                                />

                                {/* Class Description */}
                                <TextField
                                    fullWidth
                                    id="kelas_desc"
                                    name="kelas_desc"
                                    label="Class Description"
                                    value={values.kelas_desc}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.kelas_desc && Boolean(errors.kelas_desc)}
                                    helperText={touched.kelas_desc && errors.kelas_desc}
                                    variant="outlined"
                                    margin="normal"
                                />

                                {/* Class Status */}
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    select
                                    id="kelas_status"
                                    name="kelas_status"
                                    label="Class Status"
                                    value={values.kelas_status}
                                    margin="normal"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.kelas_status && Boolean(errors.kelas_status)}
                                    helperText={touched.kelas_status && errors.kelas_status}
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option value="">Select</option>
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                </TextField>

                                {/* Session ID */}
                                {/* <TextField
                                    fullWidth
                                    variant="outlined"
                                    select
                                    id="session_id"
                                    name="session_id"
                                    label="Session ID"
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
                                    {sessions.map(session => (
                                        <option key={session.session_id} value={session.session_id}>{session.session_name}</option>
                                    ))}
                                </TextField> */}
                                
                                {/* Created by (Teacher) */}
                                {/* <TextField
                                    fullWidth
                                    variant="outlined"
                                    select
                                    id="created_by"
                                    name="created_by"
                                    label="Created by (Teacher)"
                                    value={values.created_by}
                                    margin="normal"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.created_by && Boolean(errors.created_by)}
                                    helperText={touched.created_by && errors.created_by}
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option value="">Select</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher.id} value={teacher.id}>{`${teacher.first_name} ${teacher.last_name}`}</option>
                                    ))}
                                </TextField> */}

                                {/* Submit Button */}
                                <Box display="flex" justifyContent="end" mt="20px">
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

export default AddClass;
