import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// StdPrestasiLevel Data : StdPrestasiLevel --> level_id, level_score, level_desc, cri_id, actions http://127.0.0.1:8000/api/stdprestasilevel/

const AddStdPrestasiLevel = () => {
    const navigate = useNavigate();
    const [criteria, setCriteria] = useState([]);

    useEffect(() => {
        const fetchCriteria = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/stdprestasicriteria/');
                setCriteria(response.data);
            } catch (error) {
                console.error('Error fetching criteria data:', error);
            }
        };
        fetchCriteria();
    }, []);

    const validationSchema = yup.object().shape({
        level_score: yup.number().required("Score is required"),
        level_desc: yup.string().required("Description is required"),
        cri_id: yup.number().required("Criteria is required"),
    });

    const initialValues = {
        level_score: "",
        level_desc: "",
        cri_id: "",
    };

    const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
        const data = {
            ...values,
        };
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/stdprestasilevel/', data);
            console.log('Standard Prestasi Level created:', response.data);
            alert("Standard Prestasi Level created successfully!");
            resetForm();
            navigate('/createstdprestasilevel');
        } catch (error) {
            console.error('Error creating Standard Prestasi Level:', error.response?.data || error.message);
            alert("Error creating Standard Prestasi Level. Please try again later.");
        }
        setSubmitting(false);
    };

    return (
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/settings/kspk" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Settings
                    </Link>
                    <Typography color="text.primary">Standard Prestasi Tahap Penguasaan</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0px 20px">
                <Header title="STANDARD PRESTASI TAHAP PENGUASAAN" subtitle="Tambah Standard Prestasi Tahap Penguasaan" />
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
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    variant="outlined"
                                    id="level_score"
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
                                    id="level_desc"
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

export default AddStdPrestasiLevel;
