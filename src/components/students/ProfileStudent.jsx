// File Path : frontend/src/scenes/students/ProfileStudent.jsx
// Route Path : /students/:studentId

import Header from "../Header";
import { Box, Button, Tab, Tabs, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

// studentId
const ProfileStudent = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const { studentId } = useParams(); 
    const [students, setStudents] = useState(null);
    const [parent, setParent] = useState(null);
    const [loading, setLoading] = useState(true);

    const [peopleKelas, setPeopleKelas] = useState([]);
    const [peopleKelasLoading, setPeopleKelasLoading] = useState(true);
    const filteredPeopleKelas = peopleKelas.filter(item => item.student_id === parseInt(studentId));

    useEffect(() => {
        const fetchStudents = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/studentprofile/${studentId}/`);
            setStudents(response.data);
            setLoading(false);

            // Fetch parent details based on parent_id
            if (response.data.parent_id) {
                console.log('parentid: ', response.data.parent_id);
                const parentResponse = await axios.get(`http://127.0.0.1:8000/api/parentprofile/${response.data.parent_id}/`);
                setParent(parentResponse.data);
            }
        } catch (error) {
            console.error('Error fetching student:', error);
            setLoading(false);
        }
        };

        const fetchPeopleKelas = async () => {
            try {
                const studentResponse = await axios.get('http://127.0.0.1:8000/api/studentprofile/');
                const studentMap = new Map(studentResponse.data.map(student => [student.id, student.full_name]));
                console.log(studentMap);

                const enrolResponse = await axios.get('http://127.0.0.1:8000/api/kelas-session/');
                const kelasMap = new Map(enrolResponse.data.map(kelas => [kelas.kelassession_id, kelas.kelassession_name]));
                console.log(kelasMap);

                const response = await axios.get('http://127.0.0.1:8000/api/people-kelas/');
                
                const dataWithIds = response.data.map((item) => ({ ...item, id: item.peoplekelas_id, id_kelassession: item.kelassession_id,
                    full_name: studentMap.get(item.student_id) || ' ',
                    kelas_name: kelasMap.get(item.kelassession_id) || ' ', 
                }));

                setPeopleKelas(dataWithIds);
                setPeopleKelasLoading(false);
            } catch (error) {
                console.error('Error fetching people kelas:', error);
                setPeopleKelasLoading(false);
            }
        };
        
        fetchPeopleKelas();
        fetchStudents();
    }, [studentId]); 

    const getParentCategory = (category) => {
        if (category && category.includes('Ibu')) {
            return 'ibu';
        } else {
            return 'bapa';
        }
    };

    const columns = [
        { field: 'role', headerName: 'Role', flex: 1 },
        { field: 'full_name', headerName: 'Pelajar', flex: 1},
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

    const handleAssignKelasStudent = (studentId) => {
        window.location.href = `/assignkelasstudent/${studentId}`;
    }

    const handleViewKelasPeople = (kelassessionId) => {
        window.location.href = `/viewkelassession/${kelassessionId}`;
    };

    const handleUpdateStudents = (studentId) => {
        window.location.href = `/updatestudent/${studentId}`;
    }

    return (
        <Box>
        {loading ? (
            <Typography>Loading...</Typography>
        ) : students ? (
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/students" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Pelajar
                    </Link>
                    <Typography color="text.primary">Profil Pelajar - {students.full_name.charAt(0).toUpperCase() + students.full_name.slice(1)}</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="10px 0 0 20px"> 
                <Header title="PROFIL PELAJAR" />
                
                <Box boxShadow={15} p="10px">
                <Box display="flex" justifyContent="end" mr="20px">
                            {/* Update Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                onClick={() => handleUpdateStudents(students.id)}
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
                            <Typography variant="h6">Nama: {students.full_name.charAt(0).toUpperCase() + students.full_name.slice(1)}</Typography>
                            <Typography variant="h6">Status: {students.status}</Typography>
                            <Typography variant="h6">Program: Computer Science</Typography>
                            <Typography variant="h6">Kelas: A</Typography>
                            <Typography variant="h6">Sesi: 2024</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box boxShadow={15} p="10px" mt="20px"
                >
                    {/* Tab : Maklumat Peribadi, Maklumat Ibu Bapa, Maklumat Kesihatan, Dokumen */}

                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="Tabs">
                        <Tab label="Maklumat Peribadi" />
                        <Tab label="Maklumat Ibu Bapa" />
                        <Tab label="Maklumat Kesihatan" />
                        <Tab label="Maklumat Kelas" />
                        {/* <Tab label="Dokumen" /> */}
                    </Tabs>

                    {/* Action : View Maklumat Peribadi */}
                    {tabValue === 0 && (
                    <Box m="10px" color="text.primary" >
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>MAKLUMAT PERIBADI</Typography>
                        <Box boxShadow={10} p="10px" mt="20px">    
                        <TextField
                                label="ID Pelajar"
                                value={students.student_id}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="No. Kad Pengenalan"
                                value={students.ic_number}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Tarikh Lahir"
                                value={students.date_of_birth}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Tempat Lahir"
                                value={students.place_of_birth}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Nama Penuh"
                                value={students.full_name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '97%' }}
                            />
                            <TextField
                                label="Umur"
                                value={students.age}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Kewarganegaraan"
                                value={students.nationality}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            {/* gender, religion, */}
                            <TextField
                                label="Jantina"
                                value={students.gender}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Agama"
                                value={students.religion}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                        label="Alamat Rumah"
                                        variant="outlined"
                                        value={parent && parent.home_address}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        multiline
                                        style={{ margin: '10px', width: '47.5%' }}
                                    />

                        </Box>
                        
                        
                    </Box>
                    )}

                    {/* Maklumat Ibu Bapa - 2 column of ibu and bapa*/}
                    {tabValue === 1 && (
                    <Box m="10px" color="text.primary" >
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>MAKLUMAT IBU BAPA</Typography>
                            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" >
                                <Box mr={{ xs: 0, md: '20px' }} mb={{ xs: '20px', md: 0 }}>
                                    <Typography variant="h6">
                                    {parent && getParentCategory(parent.category) === 'ibu' ? 'Maklumat Ibu' : 'Maklumat Bapa'}    
                                     </Typography>
                                    <TextField
                                        label="Nama"
                                        value={parent && parent.full_name}
                                        InputProps={{
                                          readOnly: true,
                                        }}
                                        style={{ margin: '10px 20px 20px 0' }}
                                        fullWidth
                                    />
                                    <TextField
                                        label="No. Kad Pengenalan"
                                        variant="outlined"
                                        value={parent && parent.ic_number}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{ margin: '0px 20px 20px 0', width: '47%'}}
                                    />
                                    <TextField
                                        label="No. Telefon"
                                        variant="outlined"
                                        value={parent && parent.per_phone_number}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{ margin: '0px 0 20px 0', width: '47%'}}
                                    />
                                    <TextField
                                        label="Kewarganegaraan"
                                        variant="outlined"
                                        value={parent && parent.nationality}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{ margin: '0px 20px 20px 0', width: '47%'}}
                                    />
                                    <TextField
                                        label="Agama"
                                        variant="outlined"
                                        value={parent && parent.religion}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{ margin: '0px 0 20px 0', width: '47%'}}
                                    />
                                    <TextField
                                        label="Emel"
                                        variant="outlined"
                                        value={parent && parent.email}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{ margin: '0px 20px 20px 0', width: '47%'}}
                                    />
                                    <TextField
                                        label="Pekerjaan"
                                        variant="outlined"
                                        value={parent && parent.work_position}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{ margin: '0px 0 20px 0', width: '47%'}}
                                    />
                                    <TextField
                                        label="Kategori"
                                        variant="outlined"
                                        value={parent && parent.category}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                    />
                                </Box>
                                <Box>
                                <Typography variant="h6">
                                {parent && getParentCategory(parent.category) === 'ibu' ? 'Maklumat Bapa' : 'Maklumat Ibu'}
                                 </Typography>
                                    <TextField
                                        label="Nama"
                                        value={parent && parent.spouse_full_name}
                                        InputProps={{
                                          readOnly: true,
                                        }}
                                        style={{ margin: '10px 20px 20px 0' }}
                                        fullWidth
                                    />
                                    <TextField
                                        label="No. Kad Pengenalan"
                                        variant="outlined"
                                        value={parent && parent.spouse_ic_number}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{ margin: '0px 20px 20px 0', width: '47%'}}
                                    />
                                    <TextField
                                        label="No. Telefon"
                                        variant="outlined"
                                        value={parent && parent.spouse_per_phone_number}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{ margin: '0px 0 20px 0', width: '47%'}}
                                    />
                                    <TextField
                                        label="Kewarganegaraan"
                                        variant="outlined"
                                        value={parent && parent.spouse_nationality}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{ margin: '0px 20px 20px 0', width: '47%'}}
                                    />
                                    <TextField
                                        label="Agama"
                                        variant="outlined"
                                        value={parent && parent.spouse_religion}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{ margin: '0px 0 20px 0', width: '47%'}}
                                    />
                                    <TextField
                                        label="Emel"
                                        variant="outlined"
                                        value={parent && parent.spouse_email}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{ margin: '0px 20px 20px 0', width: '47%'}}
                                    />
                                    <TextField
                                        label="Pekerjaan"
                                        variant="outlined"
                                        value={parent && parent.spouse_work_position}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{ margin: '0px 0 20px 0', width: '47%'}}
                                    />
                                    <TextField
                                        label="Hubungan"
                                        variant="outlined"
                                        value={parent && parent.spouse_category}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                    />
                                </Box>
                            </Box>    
                        </Box>
                    )}
            
                    {/* Maklumat Kesihatan */}
                    {tabValue === 2 && (
                    <Box m="10px" color="text.primary" >
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>MAKLUMAT KESIHATAN</Typography>
                            <TextField
                                label="Kumpulan Darah"
                                value={students.blood_group}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Berat Badan"
                                value={students.weight}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Ketinggian"
                                value={students.height}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="BMI"
                                value={students.bmi}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '23%' }}
                            />
                            <TextField
                                label="Alahan"
                                value={students.alahan}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '47.5%' }}
                            />
                            <TextField
                                label="Penyakit"
                                value={students.penyakit}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '47.5%' }}
                            />
                        </Box>
                    )}

                    {tabValue === 3 && (
                    <Box m="10px" color="text.primary" >
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>MAKLUMAT KELAS</Typography>
                        <Box boxShadow={15} p="10px">
                            {/* TextField : choose kelasEnrollment */}
                            {/* Add New Button start : update database of person_enrolment this studentId */}
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
                                    onClick={() => handleAssignKelasStudent(students.id)}
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

                    {/* Dokumen 5 Column in Table
                    C1 - #
                    C2 - Nama Dokumen : 3 Docs: Surat Beranak/ Kad Pengenalan Pelajar, Kad Pengenalan Ibu Bapa, Rekod Imunisasi Pelajar
                    C3 - Nama Fail
                    C4 - Tarikh Hantar
                    C5 - Operasi : Tambah Rekod*/}
                    {/* {tabValue === 3 && (
                        <Box m="10px" color="text.primary">
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">#</TableCell>
                                            <TableCell align="left">Dokumen</TableCell>
                                            <TableCell align="left">Nama Fail</TableCell>
                                            <TableCell align="left">Tarikh Hantar</TableCell>
                                            <TableCell align="center">Operasi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center">1</TableCell>
                                            <TableCell>Surat Beranak/ Kad Pengenalan Pelajar</TableCell>
                                            <TableCell>Surat Beranak</TableCell>
                                            <TableCell>01/01/2021</TableCell>
                                            <TableCell align="center">
                                                <Button variant="contained" color="secondary">Tambah Rekod</Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center">2</TableCell>
                                            <TableCell>Kad Pengenalan Ibu Bapa</TableCell>
                                            <TableCell>Kad Pengenalan</TableCell>
                                            <TableCell>01/01/2021</TableCell>
                                            <TableCell align="center">
                                                <Button variant="contained" color="secondary">Tambah Rekod</Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center">3</TableCell>
                                            <TableCell>Rekod Imunisasi Pelajar</TableCell>
                                            <TableCell>Imunisasi</TableCell>
                                            <TableCell>01/01/2021</TableCell>
                                            <TableCell align="center">
                                                <Button variant="contained" color="secondary">Tambah Rekod</Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )} */}
                </Box>
            </Box>
        </Box>
        ) : (
            <Typography>Pelajar not found.</Typography>
        )}
    </Box>
    );
};

export default ProfileStudent;
