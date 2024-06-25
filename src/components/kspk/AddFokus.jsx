import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddFokus = () => {
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
        fokus_name: yup.string().required("Fokus name is required"),
        fokus_code: yup.string().required("Fokus code is required"),
        subtunjang_id: yup.string().required("Subtunjang is required"),
    });

    const initialValues = {
        fokus_name: "",
        fokus_code: "",
        fokus_desc: "",
        subtunjang_id: "",
    };

    const handleFormSubmit = async (values, { setSubmitting }) => {
        const data = {
            ...values,
        };
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/fokus/', data);
            console.log('Fokus created:', response.data);
            alert("Fokus created successfully!");
            navigate('/settings/kspk');
        } catch (error) {
            console.error('Error creating Fokus:', error.response?.data || error.message);
            alert("Error creating Fokus. Please try again later.");
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
                    <Typography color="text.primary">Fokus</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0px 20px">
                <Header title="FOKUS" subtitle="Tambah Fokus" />
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
                                    id="fokus_name"
                                    label="Nama Fokus"
                                    name="fokus_name"
                                    value={values.fokus_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.fokus_name && Boolean(errors.fokus_name)}
                                    helperText={touched.fokus_name && errors.fokus_name}
                                    style={{ margin: '20px', width: '95%' }}
                                />
                                <TextField
                                    variant="outlined"
                                    id="fokus_code"
                                    label="Kod Fokus"
                                    name="fokus_code"
                                    value={values.fokus_code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.fokus_code && Boolean(errors.fokus_code)}
                                    helperText={touched.fokus_code && errors.fokus_code}
                                    style={{ margin: '20px', width: '95%' }}
                                />
                                <TextField
                                    variant="outlined"
                                    id="fokus_desc"
                                    name="fokus_desc"
                                    label="Penerangan Fokus"
                                    value={values.fokus_desc}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.fokus_desc && Boolean(errors.fokus_desc)}
                                    helperText={touched.fokus_desc && errors.fokus_desc}
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
                                    <option value="">Sub Tunjang</option>
                                    {subtunjang.map(subtunjang => (
                                        <option key={subtunjang.subtunjang_id} value={subtunjang.subtunjang_id}>{subtunjang.subtunjang_name}</option>
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

export default AddFokus;
