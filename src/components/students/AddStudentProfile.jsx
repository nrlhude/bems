// File Path : frontend/src/components/students/AddStudent.jsx
// Route Path : /viewprofilestudent/:studentId

import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, TextField, Typography, Button, CircularProgress, Breadcrumbs } from "@mui/material";
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from "../Header";
import { useNavigate } from 'react-router-dom';
import { tokens } from "../../theme";  
import { useTheme } from "@mui/material";  

const AddStudents = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const validationSchema = yup.object().shape({
        ic_number: yup.string().required("No Kad Pengenalan is required"),
        full_name: yup.string().required("Nama Penuh is required"),
        date_of_birth: yup.date().required("Tarikh Lahir is required"),
    });

    const initialValues = {
        student_id: "",
        ic_number: "",
        full_name: "",
        date_of_birth: "",
        place_of_birth: "",
        nationality: "",
        age: 0,
        gender: "",
        religion: "",
        status: "",
        blood_group: "",
        weight: 0.0,
        height: 0,
        bmi: 0.0,
        alahan: "",
        penyakit: "",
        parent_id: "",
    };

    const handleFormSubmit = async (values, { setSubmitting }) => {
        const data = {
            ...values,
            parent_id: parents ? parents.id : null, // Use the parent ID if found, otherwise set to null
        };
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/studentprofile/', data);
            console.log(response.data);
            alert('Student created successfully!');
            navigate('/students');
        } catch (error) {
            console.error('Error creating student:', error);
            alert('Error creating student. Please try again later.');
        }
        setSubmitting(false);
    };

    const [parents, setParents] = useState(null);
    const [parentICNumber, setParentICNumber] = useState('');

    const handleParentICChange = (event) => {
        setParentICNumber(event.target.value);
    };

    const handleFindParent = async () => {
        try {
            setLoading(true);

            const response = await axios.get('http://127.0.0.1:8000/api/parentprofile/');
            const parent = response.data.find((parent) => parent.ic_number === parentICNumber);

            if (parent) {

                setParents(parent);
                setParentICNumber('');
                alert('Parent found.');
                console.log('Parent found:', parent);
                setLoading(false);
            } else {
                setParents(null);
                setParentICNumber('');
                alert('Parent not found with the provided IC number.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error finding parent:', error);
            alert('Error finding parent. Please try again later.');
        }
    };

    const getParentCategory = (category) => {
        if (category && category.includes('Ibu')) {
            return 'ibu';
        } else {
            return 'bapa';
        }
    };

    
    return(
        <Box m="10px">
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/students" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Pelajar
                    </Link>
                    <Typography color="text.primary">Tambah Pelajar </Typography>
                </Breadcrumbs>
            </Box>

            <Box m="10px 0 0px 20px">
                <Header title="TAMBAH PELAJAR" subtitle="" />


             
                <Box>
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
                            setTextFieldValue,
                        }) => (
                        <form onSubmit={handleSubmit}>
                            <Box>
                            <Box display="flex" justifyContent="flex-end" mr="20px" pb="10px">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                            </Box>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="Tabs">
                                    <Tab label="Maklumat Peribadi" />
                                    <Tab label="Maklumat Ibu Bapa" />
                                    <Tab label="Maklumat Kesihatan" />
                            </Tabs>

                            {tabValue === 0 && (
                            <Box>
                            <Box boxShadow={15} p="10px" mt="20px">
                                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>MAKLUMAT PERIBADI</Typography>
                                <TextField
                                    name="student_id"
                                    onChange={handleChange}
                                    label="ID Pelajar"
                                    value={values.student_id}
                                    style={{ margin: '10px', width: '23%' }}
                                    error={touched.student_id && Boolean(errors.student_id)}
                                    helperText={touched.student_id && errors.student_id}
                                    onBlur={handleBlur}

                                />
                                <TextField
                                    name="ic_number"
                                    onChange={handleChange}
                                    label="No. Kad Pengenalan"
                                    value={values.ic_number}
                                    style={{ margin: '10px', width: '23%' }}
                                    error={touched.ic_number && Boolean(errors.ic_number)}
                                    helperText={touched.ic_number && errors.ic_number}
                                    onBlur={handleBlur}
                                />
                                <TextField
                                    name="date_of_birth"
                                    label="Tarikh Lahir"
                                    type="date"
                                    value={values.date_of_birth}
                                    onChange={handleChange}
                                    style={{ margin: '10px', width: '23%' }}
                                    error={touched.date_of_birth && Boolean(errors.date_of_birth)}
                                    helperText={touched.date_of_birth && errors.date_of_birth}
                                    onBlur={handleBlur}
                                />
                                <TextField
                                    name="place_of_birth"
                                    label="Tempat Lahir"
                                    value={values.place_of_birth}
                                    onChange={handleChange}
                                    style={{ margin: '10px', width: '23%' }}
                                    error={touched.place_of_birth && Boolean(errors.place_of_birth)}
                                    helperText={touched.place_of_birth && errors.place_of_birth}
                                    onBlur={handleBlur}
                                />
                                
                                <TextField
                                    name="full_name"
                                    label="Nama penuh"
                                    value={values.full_name}
                                    onChange={handleChange}
                                    style={{ margin: '10px', width: '97%' }}
                                    error={touched.full_name && Boolean(errors.full_name)}
                                    helperText={touched.full_name && errors.full_name}
                                    onBlur={handleBlur}
                                />
                                
                                <TextField
                                    name="age"
                                    label="Umur"
                                    type='number'
                                    value={values.age}
                                    onChange={handleChange}
                                    style={{ margin: '10px', width: '23%' }}
                                    error={touched.age && Boolean(errors.age)}
                                    helperText={touched.age && errors.age}
                                    onBlur={handleBlur}
                                />
                                <TextField
                                    name="nationality"
                                    label="Kewarganegaraan"
                                    select
                                    value={values.nationality}
                                    onChange={handleChange}
                                    style={{ margin: '10px', width: '23%' }}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    error={touched.nationality && Boolean(errors.nationality)}
                                    helperText={touched.nationality && errors.nationality}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Kewarganegaraan</option>
                                    <option value="Malaysian">Malaysian</option>
                                    <option value="Lain-lain">Lain-lain</option>
                                </TextField>
                                <TextField
                                    name="gender"
                                    label="Jantina"
                                    select
                                    value={values.gender}
                                    onChange={handleChange}
                                    style={{ margin: '10px', width: '23%' }}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    error={touched.gender && Boolean(errors.gender)}
                                    helperText={touched.gender && errors.gender}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Jantina</option>
                                    <option value="Lelaki">Lelaki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </TextField>
                                <TextField
                                    name="religion"
                                    label="Agama"
                                    select
                                    value={values.religion}
                                    onChange={handleChange}
                                    style={{ margin: '10px', width: '23%' }}
                                    SelectProps={{
                                        native: true,
                                    }} 
                                    error={touched.religion && Boolean(errors.religion)}
                                    helperText={touched.religion && errors.religion}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Agama</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Kristian">Kristian</option>
                                    <option value="Buddha">Buddha</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Lain-lain">Lain-lain</option>
                                </TextField>
                            </Box>

                            
                            <Box boxShadow={15} p="10px" mt="20px">
                                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>STATUS</Typography>
                                
                                <TextField
                                    name="status"
                                    label="Status"
                                    select
                                    value={values.status}
                                    onChange={handleChange}
                                    style={{ margin: '10px', width: '23%' }}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    error={touched.status && Boolean(errors.status)}
                                    helperText={touched.status && errors.status}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Status Pelajar</option>
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                </TextField>
                            </Box>
                            </Box>
                            )}

                            {/* Maklumat Ibu Bapa - 2 column of ibu and bapa*/}
                            {tabValue === 1 && (
                                <Box boxShadow={15} p="10px" mt="20px">
                                <Box boxShadow={5} mb="20px">
                                <TextField
                                        name="parentICNumber"
                                        label="Cari No. Kad Pengenalan Ibu Bapa"
                                        value={parentICNumber}
                                        onChange={handleParentICChange}
                                        style={{ margin: '10px', width: '30%' }}
                                />
                                <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleFindParent}
                                        style={{ margin: '10px' }}
                                >
                                        Cari
                                </Button>
                                </Box>
                                <Typography variant="h6" color={colors.greenAccent[400]}  gutterBottom>MAKLUMAT IBU BAPA </Typography>
        
                                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" >
                                        <Box mr={{ xs: 0, md: '20px' }} mb={{ xs: '20px', md: 0 }}>
                                            <Typography variant="h6">
                                            {parents && getParentCategory(parents.category) === 'ibu' ? 'Maklumat Ibu' : 'Maklumat Bapa'}    
                                             </Typography>
                                            <TextField
                                                label="Nama"
                                                value={parents && parents.full_name}
                                                InputProps={{
                                                  readOnly: true,
                                                }}
                                                style={{ margin: '10px 20px 20px 0' }}
                                                fullWidth
                                            />
                                            <TextField
                                                label="No. Kad Pengenalan"
                                                variant="outlined"
                                                value={parents && parents.ic_number}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                style={{ margin: '0px 20px 20px 0', width: '47%'}}
                                            />
                                            <TextField
                                                label="No. Telefon"
                                                variant="outlined"
                                                value={parents && parents.per_phone_number}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                style={{ margin: '0px 0 20px 0', width: '47%'}}
                                            />
                                            <TextField
                                                label="Kewarganegaraan"
                                                variant="outlined"
                                                value={parents && parents.nationality}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                style={{ margin: '0px 20px 20px 0', width: '47%'}}
                                            />
                                            <TextField
                                                label="Agama"
                                                variant="outlined"
                                                value={parents && parents.religion}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                style={{ margin: '0px 0 20px 0', width: '47%'}}
                                            />
                                            <TextField
                                                label="Emel"
                                                variant="outlined"
                                                value={parents && parents.email}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                style={{ margin: '0px 20px 20px 0', width: '47%'}}
                                            />
                                            <TextField
                                                label="Pekerjaan"
                                                variant="outlined"
                                                value={parents && parents.work_position}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                style={{ margin: '0px 0 20px 0', width: '47%'}}
                                            />
                                            <TextField
                                                label="Kategori"
                                                variant="outlined"
                                                value={parents && parents.category}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                fullWidth
                                            />
                                        </Box>
                                        <Box>
                                        <Typography variant="h6">
                                        {parents && getParentCategory(parents.category) === 'ibu' ? 'Maklumat Bapa' : 'Maklumat Ibu'}
                                         </Typography>
                                            <TextField
                                                label="Nama"
                                                value={parents && parents.spouse_full_name}
                                                InputProps={{
                                                  readOnly: true,
                                                }}
                                                style={{ margin: '10px 20px 20px 0' }}
                                                fullWidth
                                            />
                                            <TextField
                                                label="No. Kad Pengenalan"
                                                variant="outlined"
                                                value={parents && parents.spouse_ic_number}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                style={{ margin: '0px 20px 20px 0', width: '47%'}}
                                            />
                                            <TextField
                                                label="No. Telefon"
                                                variant="outlined"
                                                value={parents && parents.spouse_per_phone_number}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                style={{ margin: '0px 0 20px 0', width: '47%'}}
                                            />
                                            <TextField
                                                label="Kewarganegaraan"
                                                variant="outlined"
                                                value={parents && parents.spouse_nationality}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                style={{ margin: '0px 20px 20px 0', width: '47%'}}
                                            />
                                            <TextField
                                                label="Agama"
                                                variant="outlined"
                                                value={parents && parents.spouse_religion}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                style={{ margin: '0px 0 20px 0', width: '47%'}}
                                            />
                                            <TextField
                                                label="Emel"
                                                variant="outlined"
                                                value={parents && parents.spouse_email}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                style={{ margin: '0px 20px 20px 0', width: '47%'}}
                                            />
                                            <TextField
                                                label="Pekerjaan"
                                                variant="outlined"
                                                value={parents && parents.spouse_work_position}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                style={{ margin: '0px 0 20px 0', width: '47%'}}
                                            />
                                            <TextField
                                                label="Hubungan"
                                                variant="outlined"
                                                value={parents && parents.spouse_category}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                fullWidth
                                            />
                                        </Box>
                                    </Box>
                            </Box>
                            )}

                            {/* Maklumat Kesihatan*/}
                            {tabValue === 2 && (

                            <Box boxShadow={15} p="10px" mt="20px">
                                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>MAKLUMAT KESIHATAN</Typography>
                                <TextField
                                    name="blood_group"
                                    onChange={handleChange}
                                    select
                                    label="Kumpulan Darah"
                                    value={values.blood_group}
                                    style={{ margin: '10px', width: '23%' }}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    error={touched.blood_group && Boolean(errors.blood_group)}
                                    helperText={touched.blood_group && errors.blood_group}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Kumpulan Darah</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="AB">AB</option>
                                    <option value="O">O</option>
                                </TextField>
                                <TextField
                                    name="weight"
                                    onChange={handleChange}
                                    type='number'
                                    label="Berat Badan (kg)"
                                    value={values.weight}
                                    style={{ margin: '10px', width: '23%' }}
                                    error={touched.weight && Boolean(errors.weight)}
                                    helperText={touched.weight && errors.weight}
                                    onBlur={handleBlur}
                                />
                                <TextField
                                    name="height"
                                    label="Ketinggian(cm)"
                                    value={values.height}
                                    onChange={handleChange}
                                    type='number'
                                    style={{ margin: '10px', width: '23%' }}
                                    error={touched.height && Boolean(errors.height)}
                                    helperText={touched.height && errors.height}
                                    onBlur={handleBlur}
                                />
                                <TextField
                                    name="bmi"
                                    label="BMI"
                                    value={values.bmi}
                                    onChange={handleChange}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    style={{ margin: '10px', width: '23%' }}
                                    error={touched.bmi && Boolean(errors.bmi)}
                                    helperText={touched.bmi && errors.bmi}
                                    onBlur={handleBlur}
                                />
                                
                                <TextField
                                    name="alahan"
                                    label="Alahan"
                                    value={values.alahan}
                                    onChange={handleChange}
                                    style={{ margin: '10px', width: '47.5%' }}
                                    error={touched.alahan && Boolean(errors.alahan)}
                                    helperText={touched.alahan && errors.alahan}
                                    onBlur={handleBlur}
                                />
                                <TextField
                                    name="penyakit"
                                    label="Penyakit"
                                    value={values.penyakit}
                                    onChange={handleChange}
                                    style={{ margin: '10px', width: '47.5%' }}
                                    error={touched.penyakit && Boolean(errors.penyakit)}
                                    helperText={touched.penyakit && errors.penyakit}
                                    onBlur={handleBlur}
                                />
                            </Box>
                            )}
                            
                            </Box>
                        </form>
                        )}
                    </Formik>
                </Box>
            </Box>
        </Box>
    );
};

export default AddStudents;