// File Path: /components/parents/UpdateParent.jsx
// Route Path: /updateparent/:parentId

import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import Header from "../Header";
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const UpdateParent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const { parentId } = useParams();

    const [parents, setParents] = useState({
        parent_id: "",
        ic_number: "",
        full_name: "",
        date_of_birth: "",
        nationality: "",
        age: "",
        gender: "",
        religion: "",
        status: "",
        email: "",
        per_phone_number: "",
        home_phone_number: "",
        home_address: "",
        work_position: "",
        work_address: "",
        category: "",
        spouse_category: "",
        spouse_ic_number: "",
        spouse_date_of_birth: "",
        spouse_age: "",
        spouse_full_name: "",
        spouse_email: "",
        spouse_per_phone_number: "",
        spouse_nationality: "",
        spouse_gender: "",
        spouse_religion: "",
        spouse_work_position: "",
        spouse_work_address: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/parentprofile/${parentId}/`);
                setParents(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching parent:', error);
                setLoading(false);
            }
        };
        fetchParents();
    }, [parentId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setParents(prevDetails => ({
            ...prevDetails,
            [name]: name === 'full_name' ? value.toUpperCase() : value
        }));
    };

    const handleUpdate = async () => {
        try {
            console.log('Updating parent with data:', parents);
            const response = await axios.put(`http://127.0.0.1:8000/api/parentprofile/${parentId}/`, parents);
            console.log('Update response:', response);
            alert('Parent updated successfully.');
            navigate(`/viewprofileparent/${parentId}`);
        } catch (error) {
            console.error('Error updating parent:', error);
            alert('Error updating parent. Please try again later.');
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
                    <Link component={RouterLink} to="/parents" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Ibu Bapa
                    </Link>
                    <Typography color="text.primary">
                    Kemaskini Ibu Bapa {parents && parents.full_name ? parents.full_name.charAt(0).toUpperCase() + parents.full_name.slice(1) : ""}

                    </Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0px 20px">
                <Header title="IBU BAPA" subtitle="Kemaskini Ibu Bapa" />

                <Box boxShadow={15} p="10px" mt="20px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>MAKLUMAT PERIBADI</Typography>
                    <TextField
                        name="parent_id"
                        onChange={handleChange}
                        label="ID Ibu Bapa"
                        value={parents.parent_id}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="ic_number"
                        onChange={handleChange}
                        label="No. Kad Pengenalan"
                        value={parents.ic_number}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="date_of_birth"
                        label="Tarikh Lahir"
                        type="date"
                        value={parents.date_of_birth}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="age"
                        label="Umur"
                        type='number'
                        value={parents.age}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="full_name"
                        label="Nama Penuh"
                        value={parents.full_name}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '97%' }}
                    />
                    <TextField
                        name="email"
                        label="Emel"
                        value={parents.email}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '47.5%' }}
                    />
                    <TextField
                        name="per_phone_number"
                        label="No Telefon Bimbit"
                        value={parents.per_phone_number}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '47.5%' }}
                    />
                    <TextField
                        name="nationality"
                        label="Kewarganegaraan"
                        select
                        value={parents.nationality}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '31%' }}
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
                        value={parents.gender}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '31%' }}
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
                        value={parents.religion}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '31%' }}
                        select
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
                        name="home_phone_number"
                        label="No Telefon Rumah"
                        value={parents.home_phone_number}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '31%' }}
                    />
                    <TextField
                        name="home_address"
                        label="Alamat Rumah"
                        multiline
                        value={parents.home_address}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '64.5%' }}
                    />
                    <TextField
                        name="work_position"
                        label="Pekerjaan"
                        value={parents.work_position}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '31%' }}
                    />
                    <TextField
                        name="work_address"
                        label="Alamat Pekerjaan"
                        value={parents.work_address}
                        onChange={handleChange}
                        multiline
                        style={{ margin: '10px', width: '64.5%' }}
                    />
                </Box>
                <Box boxShadow={15} p="10px" mt="20px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>STATUS</Typography>
                                
                    <TextField
                                    name="status"
                                    label="Status"
                                    select
                                    value={parents.status}
                                    onChange={handleChange}
                                    style={{ margin: '10px', width: '23%' }}
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option value="">Status</option>
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                    </TextField>
                    <TextField
                        name="category"
                        label="Kategori"
                        value={parents.category}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                        select
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">Kategori</option>
                        <option value="Ibu Kandung">Ibu Kandung</option>
                        <option value="Ibu Tiri">Ibu Tiri</option>
                        <option value="Ibu Angkat">Ibu Angkat</option>
                        <option value="Ayah Kandung">Ayah Kandung</option>
                        <option value="Ayah Tiri">Ayah Tiri</option>
                        <option value="Ayah Angkat">Ayah Angkat</option>
                        <option value="Penjaga (Ibu)">Penjaga (Ibu)</option>
                        <option value="Penjaga (Ayah)">Penjaga (Ayah)</option>
                    </TextField>

                </Box>

                <Box boxShadow={15} p="10px" mt="20px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>MAKLUMAT PASANGAN</Typography>
                    <TextField
                        name="spouse_category"
                        label="Kategori Pasangan"
                        value={parents.spouse_category}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                        select
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">Kategori</option>
                        <option value="Ibu Kandung">Ibu Kandung</option>
                        <option value="Ibu Tiri">Ibu Tiri</option>
                        <option value="Ibu Angkat">Ibu Angkat</option>
                        <option value="Ayah Kandung">Ayah Kandung</option>
                        <option value="Ayah Tiri">Ayah Tiri</option>
                        <option value="Ayah Angkat">Ayah Angkat</option>
                        <option value="Penjaga (Ibu)">Penjaga (Ibu)</option>
                        <option value="Penjaga (Ayah)">Penjaga (Ayah)</option>
                    </TextField>
                    <TextField
                        name="spouse_ic_number"
                        label="No. Kad Pengenalan Pasangan"
                        value={parents.spouse_ic_number}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="spouse_date_of_birth"
                        label="Tarikh Lahir Pasangan"
                        type="date"
                        value={parents.spouse_date_of_birth}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="spouse_age"
                        label="Umur Pasangan"
                        type='number'
                        value={parents.spouse_age}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        name="spouse_full_name"
                        label="Nama Penuh Pasangan"
                        value={parents.spouse_full_name}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '97%' }}
                    />
                    <TextField
                        name="spouse_email"
                        label="Emel Pasangan"
                        value={parents.spouse_email}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '47.5%' }}
                    />
                    <TextField
                        name="spouse_per_phone_number"
                        label="No Telefon Bimbit Pasangan"
                        value={parents.spouse_per_phone_number}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '47.5%' }}
                    />
                    
                    <TextField
                        name="spouse_nationality"
                        label="Kewarganegaraan Pasangan"
                        select
                        value={parents.spouse_nationality}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '31%' }}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">Kewarganegaraan</option>
                        <option value="Malaysian">Malaysian</option>
                        <option value="Lain-lain">Lain-lain</option>
                    </TextField>
                    <TextField
                        name="spouse_gender"
                        label="Jantina Pasangan"
                        select
                        value={parents.spouse_gender}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '31%' }}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">Jantina</option>
                        <option value="Lelaki">Lelaki</option>
                        <option value="Perempuan">Perempuan</option>
                    </TextField>
                    <TextField
                        name="spouse_religion"
                        label="Agama Pasangan"
                        select
                        value={parents.spouse_religion}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '31%' }}
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
                        name="spouse_work_position"
                        label="Pekerjaan Pasangan"
                        value={parents.spouse_work_position}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '31%' }}
                    />
                    <TextField
                        name="spouse_work_address"
                        label="Alamat Pekerjaan Pasangan"
                        value={parents.spouse_work_address}
                        multiline
                        onChange={handleChange}
                        style={{ margin: '10px', width: '64.5%' }}
                    />
                </Box>

                <Box display="flex" justifyContent="center" mt="20px">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontSize: "14px", fontWeight: "bold", padding: "10px 20px" }}
                    >
                        Kemaskini Ibu Bapa
                </Button>                                
                                
                </Box>
                    
            </Box>
        </Box>
    );
};

export default UpdateParent;
