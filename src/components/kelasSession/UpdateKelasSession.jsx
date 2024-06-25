// path file : frontend/src/components/kelasSession/UpdateKelasSession.jsx
// route path : /updatekelassession/:kelassessionId

import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import Header from "../Header";
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const UpdateKelasSession = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const { kelassessionId } = useParams();

    const [kelasSession, setKelasSession] = useState({
        kelassession_name: "",
        session_id: "",
        kelas_id: ""
    });

    const [sessions, setSessions] = useState([]);
    const [kelas, setKelas] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchKelasSession = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/kelas-session/${kelassessionId}/`);
                setKelasSession(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching kelas session:', error);
                setLoading(false);
            }
        };

        const fetchSessions = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
                setSessions(response.data);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        const fetchKelass = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/kelass/');
                setKelas(response.data);
            } catch (error) {
                console.error('Error fetching kelas:', error);
            }
        };

        fetchSessions();
        fetchKelass();
        fetchKelasSession();
    }, [kelassessionId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setKelasSession(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/kelas-session/${kelassessionId}/`, kelasSession);
            alert('kelas session updated successfully.');
            navigate(`/viewkelassession/${kelassessionId}`);
        } catch (error) {
            console.error('Error updating kelas session:', error);
            alert('Error updating kelas session. Please try again later.');
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
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/kelasSession" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Kelas
                    </Link>
                    <Typography color="text.primary">Kemaskini Kelas {kelasSession.kelassession_name}</Typography>
                </Breadcrumbs>
            </Box>
            <Box m="10px 0 0 20px"> 
                <Header title="KELAS" subtitle="" />

                <Box boxShadow={15} p="10px" mt="20px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>MAKLUMAT PERIBADI</Typography>
                    <TextField
                        name="kelas_id"
                        label="Kelas"
                        value={kelasSession.kelas_id}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ margin: '10px', width: '47.5%' }}
                    />
                    <TextField
                        name="session_id"
                        label="Sesi Persekolahan"
                        value={kelasSession.session_id}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ margin: '10px', width: '47.5%' }}
                    />
                    <TextField
                        name="kelas_name"
                        label="Nama Kelas"
                        value={kelasSession.kelassession_name}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '47.5%' }}
                    />
                </Box>
                <Box display="flex" justifyContent="center" mt="20px">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdate}
                        sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontSize: "14px", fontWeight: "bold", padding: "10px 20px" }}
                    >
                        Kemaskini Kelas
                    </Button>
                </Box>
            </Box>
        </Box>
    );

};

export default UpdateKelasSession;