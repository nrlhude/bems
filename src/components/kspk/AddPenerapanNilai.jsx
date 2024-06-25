import React from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

const AddPenerapanNilai = () => {
    const history = useNavigate();
    const validationSchema = yup.object().shape({
        penerapan_nilai_name: yup.string().required("Penerapan Nilai name is required"),
    });
    
    const initialValues = {
        penerapan_nilai_name: "",
        penerapan_nilai_desc: "",
    };
    
    // Handle form submission
    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
        const response = await axios.post('http://127.0.0.1:8000/api/penerapan-nilai/', values);
        console.log(response.data);
        alert("Penerapan Nilai created successfully!");
        history('/settings/kspk');
        } catch (error) {
        console.error('Error creating penerapan nilai:', error);
        alert("Error creating penerapan nilai. Please try again later.");
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
                    <Typography color="text.primary">Penerapan Nilai</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0px 20px">
                <Header title="PENERAPAN NILAI" subtitle="Tambah Penerapan Nilai" />

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
                    <TextField
                        variant="outlined"
                        id="penerapan_nilai_name"
                        name="penerapan_nilai_name"
                        label="Nama Penerapan Nilai"
                        value={values.penerapan_nilai_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.penerapan_nilai_name && Boolean(errors.penerapan_nilai_name)}
                        helperText={touched.penerapan_nilai_name && errors.penerapan_nilai_name}
                        style={{ margin: '20px', width: '95%' }}
                    />
                    <TextField
                        id="penerapan_nilai_desc"
                        name="penerapan_nilai_desc"
                        label="Penerangan Penerapan Nilai"
                        value={values.penerapan_nilai_desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.penerapan_nilai_desc && Boolean(errors.penerapan_nilai_desc)}
                        helperText={touched.penerapan_nilai_desc && errors.penerapan_nilai_desc}
                        variant="outlined"
                        style={{ margin: '20px', width: '95%' }}
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

export default AddPenerapanNilai;
