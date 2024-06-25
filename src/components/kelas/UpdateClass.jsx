// frontend/src/components/Update/UpdateClass.jsx

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../Header";
import { Link } from 'react-router-dom';


const UpdateClass = () => {
    const { classId } = useParams(); // Get the class ID from the URL params
    const navigate = useNavigate(); // Use useNavigate to redirect user to another page

    const [classData, setClassData] = useState(null); // State to store the class data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Define validation schema for form fields
    const validationSchema = yup.object().shape({
        kelas_name: yup.string().required("Class name is required"),
        kelas_code: yup.string().required("Class code is required"),
        // kelas_desc: yup.string().required("Class description is required"),
        kelas_status: yup.string().required("Class status is required"),
        // session_id: yup.string().required("Session ID is required"),
    });

    const [sessions, setSessions] = useState([]);


    // Fetch class data when component mounts
    useEffect(() => {
        const fetchClass = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/kelass/${classId}/`);
                setClassData(response.data); // Set class data to state
            }
            catch (error) {
                console.error('Error fetching class:', error);
                setError('Error fetching class data.');
            }
            finally {
                setLoading(false); // Set loading to false after data is fetched or in case of error
            }
        }
        const fetchSessions = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
                setSessions(response.data);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        fetchClass();
        fetchSessions();
        
    }, [classId]);

    // Handle form submission
    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            // Make API call to update class
            const response = await axios.put(`http://127.0.0.1:8000/api/kelass/${classId}/`, values);
            console.log('Class updated:', response.data);
            // Handle success, e.g., redirect to another page
            alert('Class updated successfully!');
            navigate('/settings/classes'); // Redirect to Classes page
        } catch (error) {
            console.error('Error updating class:', error);
            // Handle error, e.g., display error message to the user
            alert('Error updating class. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    if (error) return <Typography>{error}</Typography>;

    return (
        <Box>
            {classData ? (
                <Box>
                    <Box m="10px 0 0 20px">
                        {/* Breadcrumb with class name */}
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link component={RouterLink} to="/settings/classes" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                Settings
                            </Link>
                            <Typography color="text.primary">Update Class {classData.kelas_name}</Typography>
                        </Breadcrumbs>
                    </Box>
                    <Box m="0 20px 0px 20px">
                        {/* Header with kelas name as title */}
                        <Header title="KEMASKINI KELAS" subtitle="Kemaskini Maklumat Kelas" />
                        {/* Formik form for updating class */}
                        <Box boxShadow={15} p="10px" mt="20px">
                            <Formik
                                initialValues={classData}
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
                                        {/* Kelas Name */}
                                        <TextField
                                            variant="outlined"
                                            id="kelas_name"
                                            name="kelas_name"
                                            label="Nama Kelas"
                                            value={values.kelas_name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.kelas_name && Boolean(errors.kelas_name)}
                                            helperText={touched.kelas_name && errors.kelas_name}
                                            fullWidth
                                            sx={{ marginBottom: 2 }}
                                        />
                                        {/* Kelas Code */}
                                        <TextField
                                            variant="outlined"
                                            id="kelas_code"
                                            name="kelas_code"
                                            label="Kod Kelas"
                                            value={values.kelas_code}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.kelas_code && Boolean(errors.kelas_code)}
                                            helperText={touched.kelas_code && errors.kelas_code}
                                            fullWidth
                                            sx={{ marginBottom: 2 }}
                                        />
                                        {/* Kelas Desc */}
                                        <TextField
                                            variant="outlined"
                                            id="kelas_desc"
                                            name="kelas_desc"
                                            label="Keterangan Kelas"
                                            value={values.kelas_desc}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.kelas_desc && Boolean(errors.kelas_desc)}
                                            helperText={touched.kelas_desc && errors.kelas_desc}
                                            fullWidth
                                            sx={{ marginBottom: 2 }}
                                        />

                                        {/* Kelas Status */}
                                        <FormControl variant="outlined" style={{ margin: '2px' }} fullWidth>
                                            <InputLabel>Status Kelas</InputLabel>
                                            <Select
                                                label="Status Kelas"
                                                id="kelas_status"
                                                name="kelas_status"
                                                value={values.kelas_status}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.kelas_status && !!errors.kelas_status}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                <MenuItem value="Aktif">Aktif</MenuItem>
                                                <MenuItem value="Tidak Aktif">Tidak Aktif</MenuItem>
                                            </Select>

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

                                        </FormControl>
                                            {/* Submit Button */}
                                            <Box display="flex" justifyContent="end" mt="20px">
                                            <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                                                {isSubmitting ? 'Submitting...' : 'Update'}
                                            </Button>
                                            {/* Cancel Button */}
                                            <Button
                                                color="error"
                                                variant="contained"
                                                style={{ marginLeft: '10px' }}
                                                onClick={() => navigate('/settings/classes')}
                                            >
                                                Batal
                                            </Button>
                                        </Box>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Typography>Class not found</Typography>
            )}
        </Box>
    );
};

export default UpdateClass;