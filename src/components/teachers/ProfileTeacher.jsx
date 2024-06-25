// Path : frontend/src/components/teachers/ProfileTeacher.jsx
// /viewprofileteacher/:teacherId


import React, { useState, useEffect } from 'react';
import { Box, Button, Tab, Tabs, TextField, Breadcrumbs, Typography } from "@mui/material";import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const ProfileTeacher = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { teacherId } = useParams(); 
    const [teachers, setTeachers] = useState(null);
    const [peopleKelas, setPeopleKelas] = useState([]);
    const [peopleKelasLoading, setPeopleKelasLoading] = useState(true);
    const [loading, setLoading] = useState(true);


    const filteredPeopleKelas = peopleKelas.filter(item => item.teacher_id === parseInt(teacherId));

    useEffect(() => {
        const fetchTeachers = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/teacherprofile/${teacherId}/`);
            setTeachers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching teacher:', error);
            setLoading(false);
        }
        };
        const fetchPeopleKelas = async () => {
            try {
                const teacherResponse = await axios.get('http://127.0.0.1:8000/api/teacherprofile/');
                const teacherMap = new Map(teacherResponse.data.map(teacher => [teacher.id, teacher.full_name]));
                console.log(teacherMap);

                const enrolResponse = await axios.get('http://127.0.0.1:8000/api/kelas-session/');
                const kelasMap = new Map(enrolResponse.data.map(kelas => [kelas.kelassession_id, kelas.kelassession_name]));
                console.log(kelasMap);
                const response = await axios.get('http://127.0.0.1:8000/api/people-kelas/');
                
                const dataWithIds = response.data.map((item) => ({ ...item, id: item.peoplekelas_id, id_kelassession: item.kelassession_id,
                    full_name: teacherMap.get(item.teacher_id) || ' ',
                    kelas_name: kelasMap.get(item.kelassession_id) || ' ', 
                }));

                setPeopleKelas(dataWithIds);
                setPeopleKelasLoading(false);
            } catch (error) {
                console.error('Error fetching people kelas:', error);
                setPeopleKelasLoading(false);
            }
        };
        
        fetchTeachers();
        fetchPeopleKelas();
    }, [teacherId]); 

    // Define columns for DataGrid
    const columns = [
        { field: 'role', headerName: 'Role', flex: 1 },
        { field: 'full_name', headerName: 'Guru', flex: 1},
        { field: 'kelas_name', headerName: 'Kelas', flex: 1  },
        { field: 'status', headerName: 'Status', flex: 1},
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleViewKelasPeople(params.row.id_kelassession)}
                  sx={{ marginRight: 1 }}
                >
                  Maklumat Kelas
                </Button>
              </Box>
            ),
          },
    ];

    const handleViewKelasPeople = (kelassessionId) => {
        window.location.href = `/viewkelassession/${kelassessionId}`;
    };

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleUpdateTeachers = (teacherId) => {
        window.location.href = `/updateteacher/${teacherId}`;
    }

    const handleAssignKelasTeachers = (teacherId) => {
        window.location.href = `/assignkelasteacher/${teacherId}`;
    }

    return (
        <Box>
        {loading ? (
            <Typography>Loading...</Typography>
        ) : teachers ? (
            <Box>
                <Box m="10px 0 0 20px">
                    <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/teachers" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Guru
                    </Link>
                    <Typography color="text.primary">Profil Guru {teachers.full_name.charAt(0).toUpperCase() + teachers.full_name.slice(1)}</Typography>
                    </Breadcrumbs>
                </Box>
                <Box m="10px 0 0 20px">
                <Header title="PROFIL GURU" />

                <Box boxShadow={15} p="10px">
                    {/* Image and details */}
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection={{ xs: 'column', md: 'row' }}> {/* Adjusted flexDirection */}
                        <Box mr={{ xs: 0, md: '20px' }} mb={{ xs: '20px', md: 0 }}> {/* Adjusted margin */}
                            <img 
                                src={`../../assets/user.jpg`}
                                alt="Profile" 
                                width="200px"
                                height="200px"
                                style={{ cursor: 'pointer', borderRadius: '50%', border: '1px solid black'}}
                            />
                        </Box>
                        <Box display="flex" flexDirection="column" justifyContent="center">
                            {/* Nama, Status, Kelas, Sesi */}
                            <Typography variant="h6">Nama: {teachers.full_name.charAt(0).toUpperCase() + teachers.full_name.slice(1)}</Typography>
                            <Typography variant="h6">Status: {teachers.status}</Typography>
                            <Typography variant="h6">Kelas: A</Typography>
                            <Typography variant="h6">Sesi: 2024</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box boxShadow={15} p="10px" mt="20px"
                >
                    {/* Tab : Maklumat Peribadi, Maklumat Kelas */}

                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="Tabs">
                        <Tab label="Maklumat Peribadi" />
                        <Tab label="Maklumat Kelas" />
                    </Tabs>

                    {/* Action : View Maklumat Peribadi */}
                    {/* ic_number, first_name, last_name, email, phone_number, address, date_of_birth, age (current year - dob year), nationality (Malaysian/Others), emergency_name, emergency_phone, emergency_relationship, */}
                    {/* InputProps={{
                                      readOnly: true,
                                    }}
                                    style={{ margin: '20px 0 20px 0' }} */}
                    
                    {/* Tab 1 : Maklumat Peribadi */}
                    {tabValue === 0 && (
                    
                    <Box m="10px" color="text.primary" >
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>MAKLUMAT PERIBADI</Typography>
                        <Box boxShadow={10} p="10px" mt="20px">    
                        <TextField
                                label="ID Guru"
                                value={teachers.teacher_id}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="No. Kad Pengenalan"
                                value={teachers.ic_number}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Tarikh Lahir"
                                value={teachers.date_of_birth}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Umur"
                                value={teachers.age}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Nama Penuh"
                                value={teachers.full_name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '97%' }}
                            />
                            
                            <TextField
                                label="E-mel"
                                value={teachers.email}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Nombor Telefon"
                                value={teachers.phone_number}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Kewarganegaraan"
                                value={teachers.nationality}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            {/* gender, religion, */}
                            <TextField
                                label="Jantina"
                                value={teachers.gender}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Alamat"
                                value={teachers.address}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '47.5%' }}
                            />
                            <TextField
                                label="Agama"
                                value={teachers.religion}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Status Perkahwinan"
                                value={teachers.marrial_status}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />

                        </Box>
                        <Box boxShadow={15} p="10px" mt="20px">
                        <Typography variant="h6">Kontak Kecemasan</Typography>
                            <TextField
                                label="Nama"
                                value={teachers.emergency_name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '47.5%' }}
                            />
                            <TextField
                                label="Nombor Telefon"
                                value={teachers.emergency_phone}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '47.5%' }}
                            />
                            <TextField
                                label="Hubungan"
                                value={teachers.emergency_relationship}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '97%' }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            {/* Update Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                onClick={() => handleUpdateTeachers(teachers.id)}
                                sx={{ margin: "10px 20px" }}
                            >
                                Kemaskini
                            </Button>
                        </Box>
                    </Box>
                    )}

                    {/* Action : View Maklumat Kelas */}
                    {tabValue === 1 && (
                    
                    <Box m="10px" color="text.primary" >
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom> MAKLUMAT KELAS </Typography>
                        <Box boxShadow={15} p="10px">
                            {/* TextField : choose kelasEnrollment */}
                            {/* Add New Button start : update database of person_enrolment this teacherId */}
                            <Box m="10px 0 0 0">
                                <Button
                                    sx={{
                                        backgroundColor: colors.blueAccent[700],
                                        color: colors.grey[100],
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        padding: "10px 15px",
                                        marginBottom: "5px",
                                    }}
                                    onClick={() => handleAssignKelasTeachers(teachers.id)}
                                >
                                    <AddOutlinedIcon sx={{ mr: "10px" }} />
                                    Tambah Kelas
                                </Button>
                            {/* Add New end */}
                            </Box>
                            <Box
                                m="10px"
                                height="75vh"
                                sx={{
                                "& .MuiDataGrid-root": {
                                    border: "none",
                                },
                                "& .MuiDataGrid-cell": {
                                    borderBottom: "none",
                                },
                                "& .name-column--cell": {
                                    color: colors.greenAccent[300],
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: colors.blueAccent[700],
                                    borderBottom: "none",
                                },
                                "& .MuiDataGrid-virtualScroller": {
                                    backgroundColor: colors.primary[400],
                                },
                                "& .MuiDataGrid-footerContainer": {
                                    borderTop: "none",
                                    backgroundColor: colors.blueAccent[700],
                                },
                                "& .MuiCheckbox-root": {
                                    color: `${colors.greenAccent[200]} !important`,
                                },
                                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                    color: `${colors.grey[100]} !important`,
                                },
                                
                                }}
                            >
                            <DataGrid 
                                rows={filteredPeopleKelas} 
                                columns={columns}
                                getRowId={(row) => row.id}
                                slots={{ toolbar: GridToolbar }}
                            />
                        </Box>

                        </Box>
                    </Box>
                    )}
                </Box>
                </Box>
            </Box>
            ) : (
                <Typography>Guru not found.</Typography>
            )}
        </Box>
    );
};

export default ProfileTeacher;

