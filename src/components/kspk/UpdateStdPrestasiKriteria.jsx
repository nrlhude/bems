import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../Header";
import { Link } from 'react-router-dom';

// URL for fetching subtunjang data
const SUBTUNJANG_URL = 'http://127.0.0.1:8000/api/sub-tunjang/';
// URL for fetching and updating StdPrestasiKriteria data
const STD_PRESTASI_KRITERIA_URL = 'http://127.0.0.1:8000/api/stdprestasicriteria/';

const UpdateStdPrestasiKriteria = () => {
    const { criId } = useParams();
    const navigate = useNavigate();
    const [stdPrestasiKriteria, setStdPrestasiKriteria] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [subtunjang, setSubTunjang] = useState([]);

    const validationSchema = yup.object().shape({
        cri_code: yup.string().required("Code is required"),
        cri_desc: yup.string().required("Description is required"),
        subtunjang_id: yup.number().required("Subtunjang is required"),
    });

    useEffect(() => {
        const fetchSubTunjang = async () => {
            try {
                const response = await axios.get(SUBTUNJANG_URL);
                setSubTunjang(response.data);
            } catch (error) {
                console.error('Error fetching subtunjang data:', error);
            }
        };

        const fetchData = async () => {
            try {
                const response = await axios.get(`${STD_PRESTASI_KRITERIA_URL}${criId}/`);
                setStdPrestasiKriteria(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        
        fetchData();
        fetchSubTunjang();
    }, [criId]);

    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.put(`${STD_PRESTASI_KRITERIA_URL}${criId}/`, values);
            console.log(response.data);
            alert("StdPrestasiKriteria updated successfully!");
            navigate('/settings/kspk'); // Redirect to StdPrestasiKriteria settings page
        } catch (error) {
            console.error('Error updating StdPrestasiKriteria:', error);
            alert("Error updating StdPrestasiKriteria. Please try again later.");
        }
        setSubmitting(false);
    };

    return (
        <Box>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : stdPrestasiKriteria ? (
                <Box>
                    <Box m="10px 0 0 20px">
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link component={RouterLink} to="/settings/kspk" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                Settings
                            </Link>
                            <Typography color="text.primary">Update StdPrestasiKriteria {stdPrestasiKriteria.cri_code}</Typography>
                        </Breadcrumbs>
                    </Box>
                    <Box m="0 20px 0px 20px">
                        <Header title="STD PRESTASI KRITERIA" subtitle="Update StdPrestasiKriteria" />
                        <Box boxShadow={15} p="10px" mt="20px">
                            <Formik
                                initialValues={stdPrestasiKriteria}
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
                                        <TextField
                                            variant="outlined"
                                            type="text"
                                            label="Code"
                                            name="cri_code"
                                            value={values.cri_code}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.cri_code && Boolean(errors.cri_code)}
                                            helperText={touched.cri_code && errors.cri_code}
                                            style={{ margin: '20px', width: '95%' }}
                                        />
                                        <TextField
                                            variant="outlined"
                                            type="text"
                                            label="Description"
                                            name="cri_desc"
                                            value={values.cri_desc}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.cri_desc && Boolean(errors.cri_desc)}
                                            helperText={touched.cri_desc && errors.cri_desc}
                                            style={{ margin: '20px', width: '95%' }}
                                        />
                                        <TextField
                                            label="Sub Tunjang"
                                            name="subtunjang_id"
                                            select
                                            value={values.subtunjang_id}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.subtunjang_id && Boolean(errors.subtunjang_id)}
                                            helperText={touched.subtunjang_id && errors.subtunjang_id}
                                            style={{ margin: '20px', width: '95%' }}
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="">Select Sub Tunjang</option>
                                            {subtunjang.map(sub => (
                                                <option key={sub.subtunjang_id} value={sub.subtunjang_id}>{sub.subtunjang_name}</option>
                                            ))}
                                        </TextField>
                                        <Box display="flex" justifyContent="end" mt="20px">
                                            <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                                                {isSubmitting ? 'Submitting...' : 'Update'}
                                            </Button>
                                            <Button
                                                color="error"
                                                variant="contained"
                                                style={{ marginLeft: '10px' }}
                                                onClick={() => navigate('/settings/kspkk')}
                                            >
                                                Cancel
                                            </Button>
                                        </Box>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Typography>StdPrestasiKriteria not found.</Typography>
            )}
        </Box>
    );
};

export default UpdateStdPrestasiKriteria;
