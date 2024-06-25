// Path: frontend/src/components/teachers/UpdateTeacher.jsx
// /updateteacher/:teacherId


import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink, useParams} from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';  
import { tokens } from "../../theme";  
import { useTheme } from "@mui/material";   


const UpdateTeacher = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const { teacherId } = useParams();
    
    // Define validation schema for form fields
    const validationSchema = yup.object().shape({
        ic_number: yup.string().required("No. Kad Pengenalan is required"),
        full_name: yup.string().required("Nama Penuh is required"),
        email: yup.string().email("Invalid email").required("Email is required"),
        phone_number: yup.string().required("No Telefon is required"),
        status: yup.string().required("Status is required"),

    });
    
    // Initial teachers for form fields
    const [teachers, setTeacherDetails] = useState({
        teacher_id: "",
        ic_number: "",
        full_name: "",
        email: "",
        phone_number: "",
        address: "",
        date_of_birth: "",
        nationality: "",
        emergency_name: "",
        emergency_phone: "",
        emergency_relationship: "",
        age: "",
        gender: "",
        religion: "",
        status: "",
        marrial_status: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        const fetchTeacherDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/teacherprofile/${teacherId}/`);
                setTeacherDetails(response.data);
            } catch (error) {
                setError('Error fetching Teacher details.');
                console.error('Error fetching Teacher details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeacherDetails();
    }, [teacherId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeacherDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/teacherprofile/${teacherId}/`, teachers);
            alert('Teacher updated successfully.');
            window.location.href = `/viewprofileteacher/${teacherId}`;
        } catch (error) {
            console.error('Error updating Teacher:', error);
            alert('Error updating Teacher. Please try again later.');
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
    

    return (
        <Box m="10px">
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/teachers" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Guru
                    </Link>
                    <Typography color="text.primary">Kemaskini Maklumat Peribadi Guru {teachers.full_name.charAt(0).toUpperCase() + teachers.full_name.slice(1)}</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0px 20px">
                <Header title="GURU" subtitle="Kemaskini Guru" />

                <Box boxShadow={15} p="10px" mt="20px">
                    
                    <TextField
                        name="teacher_id"
                        onChange={handleChange}
                        label="ID Guru"
                        value={teachers.teacher_id}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="ic_number"
                        onChange={handleChange}
                        label="No. Kad Pengenalan"
                        value={teachers.ic_number}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="date_of_birth"
                        label="Tarikh Lahir"
                        type="date"
                        value={teachers.date_of_birth}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="age"
                        label="Umur"
                        type='number'
                        value={teachers.age}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="full_name"
                        label="Nama penuh"
                        value={teachers.full_name}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '97%' }}
                    />
                    <TextField
                        name="email"
                        label="E-mel"
                        type='email'
                        value={teachers.email}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="phone_number"
                        label="Nombor Telefon"
                        value={teachers.phone_number}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />

                    <TextField
                        name="nationality"
                        label="Kewarganegaraan"
                        select
                        value={teachers.nationality}
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
                        value={teachers.gender}
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
                        name="address"
                        label="Alamat"
                        type='text'
                        value={teachers.address}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '47.5%' }}
                    />
                    <TextField
                        name="religion"
                        label="Agama"
                        select
                        value={teachers.religion}
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
                    <TextField
                        name="marrial_status"
                        label="Status Perkahwinan"
                        select
                        value={teachers.marrial_status}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">Status Perkahwinan</option>
                        <option value="Bujang">Bujang</option>
                        <option value="Berkahwin">Berkahwin</option>
                        <option value="Duda">Duda</option>
                        <option value="Janda">Janda</option>
                    </TextField>

                </Box>
                <Box boxShadow={15} p="10px" mt="20px">

                <Typography variant="h6">Kontak Kecemasan</Typography>
                
                <TextField
                name="emergency_name"
                label="Nama"
                value={teachers.emergency_name}
                onChange={handleChange}
                style={{ margin: '10px', width: '23%' }}
                />
                <TextField
                    name="emergency_phone"
                    label="Nombor Telefon"
                    value={teachers.emergency_phone}
                    onChange={handleChange}
                    style={{ margin: '10px', width: '23%' }}
                />
                <TextField
                    name="emergency_relationship"
                    label="Hubungan"
                    value={teachers.emergency_relationship}
                    onChange={handleChange}
                    style={{ margin: '10px', width: '23%' }}
                />
                                
                            </Box>
                            {/* profile_image, status */}
                            <Box boxShadow={15} p="10px" mt="20px">
                                <Typography variant="h6">Status</Typography>
                                
                                <TextField
                                    name="status"
                                    label="Status"
                                    select
                                    value={teachers.status}
                                    onChange={handleChange}
                                    style={{ margin: '10px', width: '23%' }}
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option value="">Select</option>
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                </TextField>
                            </Box>

                            <Box display="flex" justifyContent="center" mt="20px">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdate}
                                    sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontSize: "14px", fontWeight: "bold", padding: "10px 20px" }}
                                >
                                    Kemaskini Guru
                                </Button>
                            </Box>
                </Box>
            </Box>
    );
};

export default UpdateTeacher;

