// frontend/src/components/Add/AddTunjangUtama.jsx

import React from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

const AddTunjangUtama = () => { 
    
    // Use useHistory to redirect user to another page
    const history = useNavigate();
    
    // Define validation schema for form fields
    const validationSchema = yup.object().shape({
        tunjang_name: yup.string().required("Tunjang name is required"),
        // tunjang_code: yup.string().required("Tunjang code is required"),
        // tunjang_desc: yup.string().required("Tunjang description is required"),
    });
    
    // Initial values for form fields
    const initialValues = {
        tunjang_name: "",
        tunjang_code: "",
        tunjang_desc: "",
    };
    
    // Handle form submission
    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
        // Make API call to create new tunjang utama
        const response = await axios.post('http://127.0.0.1:8000/api/tunjang-utama/', values);
        console.log(response.data);
        // Handle success, e.g., redirect to another page
        alert("Tunjang Utama created successfully!");
        history('/settings/kspk');
        } catch (error) {
        console.error('Error creating tunjang utama:', error);
        // Handle error, e.g., display error message to the user
        alert("Error creating tunjang utama. Please try again later.");
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
                <Typography color="text.primary">Tunjang Utama</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0px 20px">
                <Header title="TUNJANG UTAMA" subtitle="Tambah Tunjang Utama" />
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
                    {/* Tunjang Name */}
                    <TextField
                        variant="outlined"
                        id="tunjang_name"
                        name="tunjang_name"
                        label="Nama Tunjang Utama"
                        value={values.tunjang_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.tunjang_name && Boolean(errors.tunjang_name)}
                        helperText={touched.tunjang_name && errors.tunjang_name}
                        style={{ margin: '20px', width: '23%' }}
                    />

                    {/* Tunjang Code */}
                    <TextField
                        id="tunjang_code"
                        name="tunjang_code"
                        label="Kod Tunjang Utama"
                        value={values.tunjang_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.tunjang_code && Boolean(errors.tunjang_code)}
                        helperText={touched.tunjang_code && errors.tunjang_code}
                        variant="outlined"
                        style={{ margin: '20px', width: '23%' }}
                    />

                    {/* Tunjang Description */}
                    <TextField
                        id="tunjang_desc"
                        name="tunjang_desc"
                        label="Penerangan Tunjang Utama"
                        value={values.tunjang_desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.tunjang_desc && Boolean(errors.tunjang_desc)}
                        helperText={touched.tunjang_desc && errors.tunjang_desc}
                        variant="outlined"
                        style={{ margin: '20px', width: '23%' }}
                    />

                    {/* Submit Button */}
                    <Box display="flex" justifyContent="end" mt="20px">
                        <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Hantar'}
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

export default AddTunjangUtama;
    
