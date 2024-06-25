import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStdPembelajaran = () => {
    const navigate = useNavigate();
    const [std_kandungan, setStdKandungan] = useState([]);

    useEffect(() => {
        const fetchStdKandungan = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/std-kandungan/');
                setStdKandungan(response.data);
            } catch (error) {
                console.error('Error fetching std kandungan data:', error);
            }
        };
        fetchStdKandungan();
    }, []);

    const validationSchema = yup.object().shape({
        std_pembelajaran_name: yup.string().required("Standard Pembelajaran name is required"),
        std_pembelajaran_code: yup.string().required("Standard Pembelajaran code is required"),
        std_kandungan_id: yup.string().required("Standard Pembelajaran is required"),
    });

    const initialValues = {
        std_pembelajaran_name: "",
        std_pembelajaran_code: "",
        std_pembelajaran_desc: "",
        std_kandungan_id: "",
    };

    const handleFormSubmit = async (values, { setSubmitting }) => {
        const data = {
            ...values,
        };
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/std-pembelajaran/', data);
            console.log('Standard Pembelajaran created:', response.data);
            alert("Standard Pembelajaran created successfully!");
            navigate('/settings/kspk');
        } catch (error) {
            console.error('Error creating Standard Pembelajaran:', error.response?.data || error.message);
            alert("Error creating Standard Pembelajaran. Please try again later.");
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
                    <Typography color="text.primary">Standard Pembelajaran</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0px 20px">
                <Header title="STANDARD PEMBELAJARAN" subtitle="Tambah Standard Pembelajaran" />
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
                                    id="std_pembelajaran_name"
                                    label="Nama Standard Pembelajaran"
                                    name="std_pembelajaran_name"
                                    value={values.std_pembelajaran_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.std_pembelajaran_name && Boolean(errors.std_pembelajaran_name)}
                                    helperText={touched.std_pembelajaran_name && errors.std_pembelajaran_name}
                                    style={{ margin: '20px', width: '95%' }}
                                />
                                <TextField
                                    variant="outlined"
                                    id="std_pembelajaran_code"
                                    label="Kod Standard Pembelajaran"
                                    name="std_pembelajaran_code"
                                    value={values.std_pembelajaran_code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.std_pembelajaran_code && Boolean(errors.std_pembelajaran_code)}
                                    helperText={touched.std_pembelajaran_code && errors.std_pembelajaran_code}
                                    style={{ margin: '20px', width: '95%' }}
                                />
                                <TextField
                                    variant="outlined"
                                    id="std_pembelajaran_desc"
                                    name="std_pembelajaran_desc"
                                    label="Penerangan Standard Pembelajaran"
                                    value={values.std_pembelajaran_desc}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.std_pembelajaran_desc && Boolean(errors.std_pembelajaran_desc)}
                                    helperText={touched.std_pembelajaran_desc && errors.std_pembelajaran_desc}
                                    style={{ margin: '20px', width: '95%' }}
                                />
                                <TextField
                                    label="Standard Kandungan"
                                    name="std_kandungan_id"
                                    select
                                    value={values.std_kandungan_id}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.std_kandungan_id && Boolean(errors.std_kandungan_id)}
                                    helperText={touched.std_kandungan_id && errors.std_kandungan_id}
                                    style={{ margin: '20px', width: '95%' }}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">Standard Kandungan</option>
                                    {std_kandungan.map(std_kandungan => (
                                        <option key={std_kandungan.std_kandungan_id} value={std_kandungan.std_kandungan_id}>{std_kandungan.std_kandungan_name}</option>
                                    ))}
                                </TextField>

                                {/* Submit Button */}
                                <Box display="flex" justifyContent="end" m="20px">
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

export default AddStdPembelajaran;
