// File Path : frontend/src/components/parents/ProfileParent.jsx
// Route Path : /viewprofileparent/:parentId

import Header from "../Header";
import { Box, Button, Tab, Tabs, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const ProfileParent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [tabValue, setTabValue] = React.useState(0);
    const { parentId } = useParams(); 
    const [parents, setParents] = useState(null);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        const fetchParentProfile = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/parentprofile/${parentId}/`);
            setParents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching parent:', error);
            setLoading(false);
        }
        };
        
        const fetchChildren = async () => {
            try {
                // Fetch student-kelas mapping
                const studentkelasresponse = await axios.get('http://127.0.0.1:8000/api/people-kelas/');
                const studentKelasMap = new Map(studentkelasresponse.data.map(item => [item.student_id, item.kelassession_id]));

                // Fetch kelassession details
                const kelassessionResponse = await axios.get('http://127.0.0.1:8000/api/kelas-session/');
                const kelasMap = new Map(kelassessionResponse.data.map(item => [item.kelassession_id, item.kelassession_name]));

                // Fetch student profiles
                const studentResponse = await axios.get('http://127.0.0.1:8000/api/studentprofile/');
                
                // Map student profiles with kelas_name
                const dataWithIds = studentResponse.data.map(item => ({
                    ...item,
                    id: item.id,
                    parent_id: item.parent_id,
                    student_id: item.student_id,
                    full_name: item.full_name,
                    date_of_birth: item.date_of_birth,
                    gender: item.gender,
                    kelas_name: kelasMap.get(studentKelasMap.get(item.id)) || 'Unknown',
                }));

                setChildren(dataWithIds.filter(item => item.parent_id === parseInt(parentId)));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching children:', error);
                setLoading(false);
            }
        };

        fetchParentProfile();
        fetchChildren();
    }, [parentId]);

    const handleUpdateParents = (parentId) => {
        window.location.href = `/updateparent/${parentId}`;
    }

    const handleViewStudent = (studentId) => {
        window.location.href = `/viewprofilestudent/${studentId}`;
    }

    const columnsChildren = [
        // id of row is studentprofile.id
        { field: 'full_name', headerName: 'Full Name', flex: 2 },
        { field: 'date_of_birth', headerName: 'Date of Birth', flex: 1 },
        { field: 'gender', headerName: 'Gender', flex: 1 },
        { field: 'kelas_name', headerName: 'Kelas', flex: 1},
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
                  onClick={() => handleViewStudent(params.row.id)}
                  sx={{ marginRight: 1 }}
                >
                  Maklumat Anak
                </Button>
              </Box>
            ),
          },
    ];

    

    return (
        <Box>
        {loading ? (
            <Typography>Loading...</Typography>
        ) : parents ? (
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/parents" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Ibu Bapa
                    </Link>
                    <Typography color="text.primary">Profil Ibu Bapa - {parents.full_name.charAt(0).toUpperCase() + parents.full_name.slice(1)}</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="10px 0 0 20px"> 
                <Header title="PROFIL IBU BAPA" />
                
                <Box boxShadow={15} p="10px">
                    <Box display="flex" justifyContent="end" mr="20px">
                                {/* Update Button */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleUpdateParents(parents.id)}
                                    sx={{ margin: "10px 20px" }}
                                >
                                    Kemaskini
                                </Button>
                    </Box>
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
                            <Typography variant="h6">Nama: {parents.full_name.charAt(0).toUpperCase() + parents.full_name.slice(1)}</Typography>
                            <Typography variant="h6">Status: {parents.status}</Typography>
                            <Typography variant="h6">Kategori: {parents.category}</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box boxShadow={15} p="10px" mt="20px"
                >

                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="Tabs">
                        <Tab label="Maklumat Peribadi" />
                        <Tab label="Maklumat Pasangan" />
                        <Tab label="Maklumat Anak" />
                    </Tabs>

                    {/* Action : View Maklumat Peribadi */}
                    {tabValue === 0 && (
                    <Box m="10px" color="text.primary" >
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>MAKLUMAT PERIBADI</Typography>
                        <Box boxShadow={10} p="10px" mt="20px">    
                        <TextField
                                label="ID Ibu Bapa"
                                value={parents.parent_id}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="No. Kad Pengenalan"
                                value={parents.ic_number}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Tarikh Lahir"
                                value={parents.date_of_birth}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Umur"
                                value={parents.age}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Nama Penuh"
                                value={parents.full_name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '97%' }}
                            />
                            <TextField
                                label="Emel"
                                value={parents.email}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '47.5%' }}
                            />
                            <TextField
                                label="No Telefon Bimbit"
                                value={parents.per_phone_number}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '47.5%' }}
                            />
                            <TextField
                                label="Kewarganegaraan"
                                value={parents.nationality}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '31%' }}
                            />
                            {/* gender, religion, */}
                            <TextField
                                label="Jantina"
                                value={parents.gender}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '31%' }}
                            />
                            <TextField
                                label="Agama"
                                value={parents.religion}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '31%' }}
                            />
                            <TextField
                                label="No Telefon Rumah"
                                value={parents.home_phone_number}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '31%' }}
                            />
                            <TextField
                                label="Alamat Rumah"
                                value={parents.home_address}
                                InputProps={{
                                    readOnly: true,
                                }}
                                multiline
                                style={{ margin: '10px', width: '64.5%' }}
                            />
                            <TextField
                                label="Pekerjaan"
                                value={parents.work_position}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '31%' }}
                            />
                            <TextField
                                label="Alamat Pekerjaan"
                                value={parents.work_address}
                                InputProps={{
                                    readOnly: true,
                                }}
                                multiline
                                style={{ margin: '10px', width: '64.5%' }}
                            />

                        </Box>
                    </Box>
                    )}
                    
                    {tabValue === 1 && (
                    <Box m="10px" color="text.primary" >
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>MAKLUMAT PASANGAN</Typography>
                        <Box boxShadow={10} p="10px" mt="20px">    
                        <TextField
                                label="Kategori Pasangan"
                                value={parents.spouse_category}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="No. Kad Pengenalan"
                                value={parents.spouse_ic_number}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Tarikh Lahir"
                                value={parents.spouse_date_of_birth}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Umur"
                                value={parents.spouse_age}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Nama Penuh"
                                value={parents.spouse_full_name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '97%' }}
                            />
                            <TextField
                                label="Emel"
                                value={parents.spouse_email}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '47.5%' }}
                            />
                            <TextField
                                label="No Telefon Bimbit"
                                value={parents.spouse_per_phone_number}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '47.5%' }}
                            />
                            <TextField
                                label="Kewarganegaraan"
                                value={parents.spouse_nationality}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '31%' }}
                            />
                            {/* gender, religion, */}
                            <TextField
                                label="Jantina"
                                value={parents.spouse_gender}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '31%' }}
                            />
                            <TextField
                                label="Agama"
                                value={parents.spouse_religion}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '31%' }}
                            />
                            <TextField
                                label="Pekerjaan"
                                value={parents.spouse_work_position}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '31%' }}
                            />
                            <TextField
                                label="Alamat Pekerjaan"
                                value={parents.spouse_work_address}
                                InputProps={{
                                    readOnly: true,
                                }}
                                multiline
                                style={{ margin: '10px', width: '64.5%' }}
                            />

                        </Box>
                    </Box>
                    )}
                    
                    
                    {tabValue === 2 && (
                    <Box m="10px" color="text.primary" >
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>MAKLUMAT ANAK</Typography>

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
                                rows={children} 
                                columns={columnsChildren}
                                getRowId={(row) => row.id}
                                slots={{ toolbar: GridToolbar }}
                            />
                        </Box>
                    </Box>

                    )}
                </Box>

            </Box>
        </Box>
        ) : (
                <Typography>Ibu Bapa not found.</Typography>
            )}
        </Box>
    );
};

export default ProfileParent;