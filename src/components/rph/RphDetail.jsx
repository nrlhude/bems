import Header from "../Header";
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";


// View RPH details
const RphDetails = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { rphID } = useParams(); 
    const [rphDetails, setRphDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRphDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/rph/${rphID}/`);
                setRphDetails(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching rph details:', error);
                setLoading(false);
            }
        };
        fetchRphDetails();
    }, [rphID]); 

    return (
        <Box>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : rphDetails ? (
                <Box>
                    <Box m="10px 0 0 20px">
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link component={RouterLink} to="/rph" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                Rutin Pengajaran Harian (RPH)
                            </Link>
                            <Typography color="text.primary">Butiran RPH</Typography>
                        </Breadcrumbs>
                    </Box>

                    <Box m="0 0 0 20px">
                        <Header title="BUTIRAN RPH" subtitle="" />

                        <Box boxShadow={15} p="10px" mt="20px">
                            <Box m="0 0 0 20px">
                                <TextField
                                    label="Tarikh"
                                    value={rphDetails.tarikh}
                                    style={{margin: '10px', width: '23%'}}
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Masa"
                                    value={rphDetails.masa}
                                    style={{margin: '10px', width: '23%'}}
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Bilangan Murid"
                                    value={rphDetails.bilangan_murid}
                                    style={{margin: '10px', width: '23%'}}
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Kelas"
                                    value={rphDetails.kelas}
                                    style={{margin: '10px', width: '23%'}}
                                    InputProps={{ readOnly: true }}
                                />
                            </Box>
                            <Box m="0 40px 0 20px">
                                <TextField
                                    label="Tajuk"
                                    value={rphDetails.tajuk}
                                    style={{margin: '10px'}}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Tema"
                                    value={rphDetails.tema}
                                    style={{margin: '10px'}}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Tunjang Utama"
                                    value={rphDetails.tunjang_utama}
                                    style={{margin: '10px'}}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Fokus"
                                    value={rphDetails.fokus}
                                    style={{margin: '10px'}}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Standard Kandungan"
                                    value={rphDetails.standard_kandungan}
                                    style={{margin: '10px'}}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Standard Pembelajaran"
                                    value={rphDetails.standard_pembelajaran}
                                    style={{margin: '10px'}}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Kesepaduan Tunjang"
                                    value={rphDetails.kesepaduan_tunjang}
                                    style={{margin: '10px'}}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Pengetahuan Sedia Ada"
                                    value={rphDetails.pengetahuan_sedia_ada}
                                    style={{margin: '10px'}}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Objektif Pembelajaran"
                                    value={rphDetails.objektif_pembelajaran}
                                    style={{margin: '10px'}}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Hasil Pembelajaran"
                                    value={rphDetails.hasil_pembelajaran}
                                    style={{margin: '10px'}}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Bahan Bantu Mengajar (BBM)"
                                    value={rphDetails.bahan_bantu_mengajar}
                                    style={{margin: '10px'}}
                                    InputProps={{ readOnly: true }}
                                    fullWidth   
                                />
                                <TextField
                                    label="Kemahiran Berfikir (KBAT)"
                                    value={rphDetails.kemahiran_berfikir}
                                    style={{margin: '10px', width: '45%'}}
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Penerapan Nilai"
                                    value={rphDetails.penerapan_nilai}
                                    style={{margin: '10px', width: '45%'}}
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Aktiviti"
                                    value={rphDetails.aktiviti}
                                    style={{margin: '10px'}}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Refleksi"
                                    value={rphDetails.refleksi}
                                    style={{margin: '10px'}}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                {/* You can uncomment this if you want to display the 'Lampiran' field */}
                                {/* <TextField
                                    label="Lampiran"
                                    value={rphDetails.lampiran}
                                    style={{margin: '10px'}}
                                    InputProps={{ readOnly: true }}
                                /> */}
                            </Box>
                    {/* Update Button */}

                    {/* Evaluate Button */}

                </Box>
            </Box>
            </Box>
        ) : (
            <Typography>RPH not found</Typography>
        )}
        </Box>
    );
};

export default RphDetails;