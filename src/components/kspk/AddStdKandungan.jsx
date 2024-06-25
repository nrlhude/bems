import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStdKandungan = () => {
    const navigate = useNavigate();
    const [fokus, setFokus] = useState([]);

    useEffect(() => {
        const fetchFokus = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/fokus/');
                setFokus(response.data);
            } catch (error) {
                console.error('Error fetching fokus data:', error);
            }
        };
        fetchFokus();
    }, []);

    const validationSchema = yup.object().shape({
        std_kandungan_name: yup.string().required("Standard Kandungan name is required"),
        std_kandungan_code: yup.string().required("Standard Kandungan code is required"),
        fokus_id: yup.string().required("Standard Kandungan is required"),
    });

    const initialValues = {
        std_kandungan_name: "",
        std_kandungan_code: "",
        std_kandungan_desc: "",
        fokus_id: "",
    };

    const handleFormSubmit = async (values, { setSubmitting }) => {
        const data = {
            ...values,
        };
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/std-kandungan/', data);
            console.log('Standard Kandungan created:', response.data);
            alert("Standard Kandungan created successfully!");
            navigate('/settings/kspk');
        } catch (error) {
            console.error('Error creating Standard Kandungan:', error.response?.data || error.message);
            alert("Error creating Standard Kandungan. Please try again later.");
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
                    <Typography color="text.primary">Standard Kandungan</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0px 20px">
                <Header title="STANDARD KANDUNGAN" subtitle="Tambah Standard Kandungan" />
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
                                    id="std_kandungan_name"
                                    label="Nama Standard Kandungan"
                                    name="std_kandungan_name"
                                    value={values.std_kandungan_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.std_kandungan_name && Boolean(errors.std_kandungan_name)}
                                    helperText={touched.std_kandungan_name && errors.std_kandungan_name}
                                    style={{ margin: '20px', width: '95%' }}
                                />
                                <TextField
                                    variant="outlined"
                                    id="std_kandungan_code"
                                    label="Kod Standard Kandungan"
                                    name="std_kandungan_code"
                                    value={values.std_kandungan_code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.std_kandungan_code && Boolean(errors.std_kandungan_code)}
                                    helperText={touched.std_kandungan_code && errors.std_kandungan_code}
                                    style={{ margin: '20px', width: '95%' }}
                                />
                                <TextField
                                    variant="outlined"
                                    id="std_kandungan_desc"
                                    name="std_kandungan_desc"
                                    label="Penerangan Standard Kandungan"
                                    value={values.std_kandungan_desc}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.std_kandungan_desc && Boolean(errors.std_kandungan_desc)}
                                    helperText={touched.std_kandungan_desc && errors.std_kandungan_desc}
                                    style={{ margin: '20px', width: '95%' }}
                                />
                                <TextField
                                    label="Fokus"
                                    name="fokus_id"
                                    select
                                    value={values.fokus_id}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.fokus_id && Boolean(errors.fokus_id)}
                                    helperText={touched.fokus_id && errors.fokus_id}
                                    style={{ margin: '20px', width: '95%' }}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">Fokus</option>
                                    {fokus.map(fokus => (
                                        <option key={fokus.fokus_id} value={fokus.fokus_id}>{fokus.fokus_name}</option>
                                    ))}
                                </TextField>

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

export default AddStdKandungan;
