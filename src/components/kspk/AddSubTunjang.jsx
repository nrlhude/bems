import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddSubTunjang = () => {
    const navigate = useNavigate();
    const [tunjangUtama, setTunjangUtama] = useState([]);

    useEffect(() => {
        const fetchTunjangUtama = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/tunjang-utama/');
                setTunjangUtama(response.data);
            } catch (error) {
                console.error('Error fetching tunjang utama data:', error);
            }
        };
        fetchTunjangUtama();
    }, []);

    const validationSchema = yup.object().shape({
        subtunjang_name: yup.string().required("Subtunjang name is required"),
        subtunjang_code: yup.string().required("Subtunjang code is required"),
        tunjang_id: yup.string().required("Tunjang Utama is required"),
    });

    const initialValues = {
        subtunjang_name: "",
        subtunjang_code: "",
        subtunjang_desc: "",
        tunjang_id: "",
    };

    const handleFormSubmit = async (values, { setSubmitting }) => {
        const data = {
            ...values,
        };
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/sub-tunjang/', data);
            console.log('Sub Tunjang created:', response.data);
            alert("Sub Tunjang created successfully!");
            navigate('/settings/kspk');
        } catch (error) {
            console.error('Error creating Sub Tunjang:', error.response?.data || error.message);
            alert("Error creating Sub Tunjang. Please try again later.");
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
                    <Typography color="text.primary">Sub Tunjang</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0px 20px">
                <Header title="SUB TUNJANG" subtitle="Tambah Sub Tunjang" />

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
                                    id="subtunjang_name"
                                    label="Nama Sub Tunjang"
                                    name="subtunjang_name"
                                    value={values.subtunjang_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.subtunjang_name && Boolean(errors.subtunjang_name)}
                                    helperText={touched.subtunjang_name && errors.subtunjang_name}
                                    style={{ margin: '20px', width: '95%' }}
                                />
                                <TextField
                                    variant="outlined"
                                    id="subtunjang_code"
                                    label="Kod Sub Tunjang"
                                    name="subtunjang_code"
                                    value={values.subtunjang_code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.subtunjang_code && Boolean(errors.subtunjang_code)}
                                    helperText={touched.subtunjang_code && errors.subtunjang_code}
                                    style={{ margin: '20px', width: '95%' }}
                                />
                                <TextField
                                    variant="outlined"
                                    id="subtunjang_desc"
                                    name="subtunjang_desc"
                                    label="Penerangan Sub Tunjang"
                                    value={values.subtunjang_desc}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.subtunjang_desc && Boolean(errors.subtunjang_desc)}
                                    helperText={touched.subtunjang_desc && errors.subtunjang_desc}
                                    style={{ margin: '20px', width: '95%' }}
                                />
                                <TextField
                                    label="Tunjang Utama"
                                    name="tunjang_id"
                                    select
                                    value={values.tunjang_id}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.tunjang_id && Boolean(errors.tunjang_id)}
                                    helperText={touched.tunjang_id && errors.tunjang_id}
                                    style={{ margin: '20px', width: '95%' }}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">Tunjang Utama</option>
                                    {tunjangUtama.map(tunjang => (
                                        <option key={tunjang.tunjang_id} value={tunjang.tunjang_id}>{tunjang.tunjang_name}</option>
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

export default AddSubTunjang;
