import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// StdPrestasiKriteria Data : StdPrestasiCriteria --> cri_id, cri_code, cri_desc, subtunjang_id, actions http://127.0.0.1:8000/api/stdprestasicriteria/

const AddStdPrestasiKriteria = () => {
    const navigate = useNavigate();
    const [subtunjang, setSubTunjang] = useState([]);

    useEffect(() => {
        const fetchSubTunjang = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/sub-tunjang/');
                setSubTunjang(response.data);
            } catch (error) {
                console.error('Error fetching sub tunjang data:', error);
            }
        };
        fetchSubTunjang();
    }, []);

    const validationSchema = yup.object().shape({
        cri_code: yup.string().required("Code is required"),
        cri_desc: yup.string().required("Description is required"),
        subtunjang_id: yup.number().required("Subtunjang is required"),
    });

    const initialValues = {
        cri_code: "",
        cri_desc: "",
        subtunjang_id: "",
    };

    const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
        const data = {
            ...values,
        };
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/stdprestasicriteria/', data);
            console.log('Standard Prestasi Kriteria created:', response.data);
            alert("Standard Prestasi Kriteria created successfully!");
            resetForm();
            navigate('/createstdprestasicriteria');

        } catch (error) {
            console.error('Error creating Standard Prestasi Kriteria:', error.response?.data || error.message);
            alert("Error creating Standard Prestasi Kriteria. Please try again later.");
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
                    <Typography color="text.primary">Standard Prestasi Kriteria</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0px 20px">
                <Header title="STANDARD PRESTASI KRITERIA" subtitle="Tambah Standard Prestasi Kriteria" />
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
                                    id="cri_code"
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
                                    id="cri_desc"
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
                                    {subtunjang.map(subtunjang => (
                                        <option key={subtunjang.subtunjang_id} value={subtunjang.subtunjang_id}>{subtunjang.subtunjang_name}</option>
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

export default AddStdPrestasiKriteria;
