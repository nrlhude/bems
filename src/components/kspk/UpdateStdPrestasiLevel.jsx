import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../Header";
import { Link } from 'react-router-dom';

// URLs for fetching data
const STD_PRESTASI_KRITERIA_URL = 'http://127.0.0.1:8000/api/stdprestasicriteria/';
const STD_PRESTASI_LEVEL_URL = 'http://127.0.0.1:8000/api/stdprestasilevel/';

const UpdateStdPrestasiLevel = () => {
    const { levelId } = useParams();
    const navigate = useNavigate();
    const [stdPrestasiLevel, setStdPrestasiLevel] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [criteria, setCriteria] = useState([]);

    const validationSchema = yup.object().shape({
        level_score: yup.number().required("Score is required"),
        level_desc: yup.string().required("Description is required"),
        cri_id: yup.string().required("Criteria is required"),
    });

    useEffect(() => {
        const fetchCriteria = async () => {
            try {
                const response = await axios.get(STD_PRESTASI_KRITERIA_URL);
                setCriteria(response.data);
            } catch (error) {
                console.error('Error fetching criteria data:', error);
            }
        };

        const fetchData = async () => {
            try {
                const response = await axios.get(`${STD_PRESTASI_LEVEL_URL}${levelId}/`);
                setStdPrestasiLevel(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        
        fetchData();
        fetchCriteria();
    }, [levelId]);

    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.put(`${STD_PRESTASI_LEVEL_URL}${levelId}/`, values);
            console.log(response.data);
            alert("StdPrestasiLevel updated successfully!");
            navigate('/settings/kspk'); // Redirect to StdPrestasiLevel settings page
        } catch (error) {
            console.error('Error updating StdPrestasiLevel:', error);
            alert("Error updating StdPrestasiLevel. Please try again later.");
        }
        setSubmitting(false);
    };

    return (
        <Box>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : stdPrestasiLevel ? (
                <Box>
                    <Box m="10px 0 0 20px">
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link component={RouterLink} to="/settings/kspk" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                Settings
                            </Link>
                            <Typography color="text.primary"> Kemaskini Standard Prestasi Tahap Penguasaan {stdPrestasiLevel.level_id}</Typography>
                        </Breadcrumbs>
                    </Box>
                    <Box m="0 20px 0px 20px">
                        <Header title="STANDARD PRESTASI TAHAP PENGUASAAN" subtitle="Kemaskini Standard Prestasi Tahap Penguasaan" />
                        <Box boxShadow={15} p="10px" mt="20px">
                            <Formik
                                initialValues={stdPrestasiLevel}
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
                                            type="number"
                                            label="Score"
                                            name="level_score"
                                            value={values.level_score}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.level_score && Boolean(errors.level_score)}
                                            helperText={touched.level_score && errors.level_score}
                                            style={{ margin: '20px', width: '95%' }}
                                        />
                                        <TextField
                                            variant="outlined"
                                            type="text"
                                            label="Description"
                                            name="level_desc"
                                            value={values.level_desc}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.level_desc && Boolean(errors.level_desc)}
                                            helperText={touched.level_desc && errors.level_desc}
                                            style={{ margin: '20px', width: '95%' }}
                                        />
                                        <TextField
                                            label="Criteria"
                                            name="cri_id"
                                            select
                                            value={values.cri_id}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.cri_id && Boolean(errors.cri_id)}
                                            helperText={touched.cri_id && errors.cri_id}
                                            style={{ margin: '20px', width: '95%' }}
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="">Select Criteria</option>
                                            {criteria.map(cri => (
                                                <option key={cri.cri_id} value={cri.cri_id}>{cri.cri_code}</option>
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
                                                onClick={() => navigate('/settings/kspk')}
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
                <Typography>StdPrestasiLevel not found.</Typography>
            )}
        </Box>
    );
};

export default UpdateStdPrestasiLevel;
