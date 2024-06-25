// File Path : frontend/src/components/students/UpdateStudent.jsx
// Route Path : /updateprofilestudent/:studentId

import React, { useEffect, useState } from 'react';
import { Box, Button, Tab, Tabs, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink, useParams} from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';  
import { tokens } from "../../theme";  
import { useTheme } from "@mui/material";  

const UpdateStudent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const { studentId } = useParams();

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const [students, setStudents] = useState({
        student_id: "",
        ic_number: "",
        full_name: "",
        date_of_birth: "",
        place_of_birth: "",
        nationality: "",
        age: "",
        gender: "",
        religion: "",
        status: "",
        blood_group: "",
        weight: 0,
        height: 0,
        bmi: 0,
        alahan: "",
        penyakit: "",
        parent_id: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setStudents(prevDetails => ({
                    ...prevDetails,
                    parent_id: parent.id,
                }));

                setParents(parent);
                setParentICNumber('');
                alert('Parent found.');
                console.log('Parent found:', parent);
                setLoading(false);
            } else {
                alert('Parent not found with the provided IC number.');
                setParents(null);
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

    useEffect(() => {
        const fetchStudents = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/studentprofile/${studentId}/`);
            setStudents(response.data);
            setLoading(false);

            if (response.data.parent_id) {
                fetchParent(response.data.parent_id);
            }
        } catch (error) {
            console.error('Error fetching student:', error);
            setLoading(false);
        }
        };

        const fetchParent = async (parentId) => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/parentprofile/${parentId}/`);
                setParents(response.data);
            } catch (error) {
                console.error('Error fetching parent:', error);
            }
        };


        fetchStudents();
    }, [studentId]); 

    const handleChange = (event) => {
        const { name, value } = event.target;
        setStudents(prevDetails => {
            const updatedStudents = { ...prevDetails, [name]: name === 'full_name' ? value.toUpperCase() : value };
    
            if (name === 'weight' || name === 'height') {
                const weight = parseFloat(updatedStudents.weight);
                const height = parseFloat(updatedStudents.height);
    
                if (!isNaN(weight) && !isNaN(height) && height > 0) {
                    const bmi = weight / ((height / 100) ** 2);
                    updatedStudents.bmi = parseFloat(bmi.toFixed(3));
                } else {
                    updatedStudents.bmi = '';
                }
            }

            return updatedStudents;
        });
    };
    
    

    const handleUpdate = async () => {
        try {
            console.log('Updating student with data:', students);
            const response = await axios.put(`http://127.0.0.1:8000/api/studentprofile/${studentId}/`, students);
            console.log('Update response:', response); 
            alert('Student updated successfully.');
            window.location.href = `/viewprofilestudent/${studentId}`;
        } catch (error) {
            console.error('Error updating Student:', error);
            alert('Error updating Student. Please try again later.');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    console.log('Parent:', parents);

    return (
        <Box m="10px">
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/students" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Pelajar
                    </Link>
                    <Typography color="text.primary">Kemaskini Pelajar {students.full_name.charAt(0).toUpperCase() + students.full_name.slice(1)}</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0px 20px">
                <Header title="PELAJAR" subtitle="Kemaskini Pelajar" />
                <Box display="flex" justifyContent="flex-end" mr="40px" pb="10px">
                    <Button variant="contained" color="primary" onClick={handleUpdate}
                        sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], padding: "10px 20px" }}
                    > Kemaskini
                    </Button>
                </Box>
            <Box>
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
                        value={students.student_id}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="ic_number"
                        onChange={handleChange}
                        label="No. Kad Pengenalan"
                        value={students.ic_number}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="date_of_birth"
                        label="Tarikh Lahir"
                        type="date"
                        value={students.date_of_birth}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="place_of_birth"
                        label="Tempat Lahir"
                        value={students.place_of_birth}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    
                    <TextField
                        name="full_name"
                        label="Nama penuh"
                        value={students.full_name}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '97%' }}
                    />
                    
                    <TextField
                        name="age"
                        label="Umur"
                        type='number'
                        value={students.age}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="nationality"
                        label="Kewarganegaraan"
                        select
                        value={students.nationality}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">Kewarganegaraan</option>
                        <option value="Malaysian">Malaysian</option>
                        <option value="Lain-lain">Lain-lain</option>
                    </TextField>
                    <TextField
                        name="gender"
                        label="Jantina"
                        select
                        value={students.gender}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">Jantina</option>
                        <option value="Lelaki">Lelaki</option>
                        <option value="Perempuan">Perempuan</option>
                    </TextField>
                    <TextField
                        name="religion"
                        label="Agama"
                        select
                        value={students.religion}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                        SelectProps={{
                            native: true,
                        }} 
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
                                    value={students.status}
                                    onChange={handleChange}
                                    style={{ margin: '10px', width: '23%' }}
                                    SelectProps={{
                                        native: true,
                                    }}
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
                        value={students.blood_group}
                        style={{ margin: '10px', width: '23%' }}
                        SelectProps={{
                            native: true,
                        }}
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
                        value={students.weight}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="height"
                        label="Ketinggian(cm)"
                        value={students.height}
                        onChange={handleChange}
                        type='number'
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="bmi"
                        label="BMI"
                        value={students.bmi}
                        onChange={handleChange}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    
                    <TextField
                        name="alahan"
                        label="Alahan"
                        value={students.alahan}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '47.5%' }}
                    />
                    <TextField
                        name="penyakit"
                        label="Penyakit"
                        value={students.penyakit}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '47.5%' }}
                    />
                </Box>
                )}
            </Box>

            </Box>
        </Box>
    );
};

export default UpdateStudent;

