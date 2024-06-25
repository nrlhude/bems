import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography, Link as MuiLink} from "@mui/material";
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from "../Header";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const UpdateRPH = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { rphID } = useParams();
    const navigate = useNavigate();
    const [rphDetails, setRphDetails] = useState({
        tarikh: '',
        masa: '',
        bilangan_murid: '',
        kelas: '',
        tajuk: '',
        tema: '',
        tunjang_utama: '',
        fokus: '',
        standard_kandungan: '',
        standard_pembelajaran: '',
        kesepaduan_tunjang: '',
        pengetahuan_sedia_ada: '',
        objektif_pembelajaran: '',
        hasil_pembelajaran: '',
        bahan_bantu_mengajar: '',
        kemahiran_berfikir: '',
        penerapan_nilai: '',
        aktiviti: '',
        refleksi: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [kelasEnrolment, setKelasEnrolment] = useState([]);
    const [tunjangUtama, setTunjangUtama] = useState([]);
    const [fokus, setFokus] = useState([]);
    const [standardKandungan, setStandardKandungan] = useState([]);
    const [standardPembelajaran, setStandardPembelajaran] = useState([]);
    const [kesepaduanTunjang, setKesepaduanTunjang] = useState([]);
    const [penerapanNilai, setPenerapanNilai] = useState([]);


    useEffect(() => {
        const fetchRphDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/rph/${rphID}/`);
                setRphDetails(response.data);
            } catch (error) {
                setError('Error fetching RPH details.');
                console.error('Error fetching RPH details:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchKelas = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/kelas-session/');
                setKelasEnrolment(response.data);
            } catch (error) {
                console.error('Error fetching kelas data:', error);
            }
        };

        const fetchTunjangUtama = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/tunjang-utama/');
                setTunjangUtama(response.data);
            } catch (error) {
                console.error('Error fetching tunjang utama data:', error);
            }
        };
        const fetchFokus = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/fokus/');
                setFokus(response.data);
            } catch (error) {
                console.error('Error fetching fokus data:', error);
            }
        };
    
        const fetchStandardKandungan = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/std-kandungan/');
                setStandardKandungan(response.data);
            } catch (error) {
                console.error('Error fetching standard kandungan data:', error);
            }
        };
    
        const fetchStandardPembelajaran = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/std-pembelajaran/');
                setStandardPembelajaran(response.data);
            } catch (error) {
                console.error('Error fetching standard pembelajaran data:', error);
            }
        };
    
        const fetchKesepaduanTunjang = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/tunjang-utama/');
                setKesepaduanTunjang(response.data);
            } catch (error) {
                console.error('Error fetching kesepaduan tunjang data:', error);
            }
        };
    
        const fetchPenerapanNilai = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/penerapan-nilai/');
                setPenerapanNilai(response.data);
            } catch (error) {
                console.error('Error fetching penerapan nilai data:', error);
            }
        };

        // Call all fetch functions
        fetchKelas();
        fetchTunjangUtama();
        fetchFokus();
        fetchStandardKandungan();
        fetchStandardPembelajaran();
        fetchKesepaduanTunjang();
        fetchPenerapanNilai();
        fetchRphDetails();
    }, [rphID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRphDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/rph/${rphID}/`, rphDetails);
            alert('RPH updated successfully.');
            navigate('/rph');
        } catch (error) {
            console.error('Error updating RPH:', error);
            alert('Error updating RPH. Please try again later.');
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
            <Breadcrumbs aria-label="breadcrumb">
                <MuiLink component={RouterLink} to="/rph" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Rutin Pengajaran Harian (RPH)
                </MuiLink>
                <Typography color="text.primary">Update RPH</Typography>
            </Breadcrumbs>

            <Header title="UPDATE RPH" subtitle="" />

            <Box boxShadow={15} p="10px" mt="20px">
                <Box display="flex" flexWrap="wrap">
                    <TextField
                        label="Tarikh"
                        name="tarikh"
                        value={rphDetails.tarikh}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        label="Masa"
                        name="masa"
                        value={rphDetails.masa}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        label="Bilangan Murid"
                        name="bilangan_murid"
                        value={rphDetails.bilangan_murid}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        label="Kelas"
                        name="kelas" 
                        value={rphDetails.kelas}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                        select
                        SelectProps={{ native: true }}
                    >
                        <option value="">Kelas</option>
                        {kelasEnrolment.map(kelas => (
                            <option key={kelas.kelassession_id} value={kelas.kelassession_name}>{kelas.kelassession_name}</option>
                            ))}
                    </TextField>
                </Box>
                <Box display="flex" flexWrap="wrap">
                    <TextField
                        label="Tajuk"
                        name="tajuk"
                        value={rphDetails.tajuk}
                        onChange={handleChange}
                        style={{ margin: '10px' }}
                        fullWidth
                    />
                    <TextField
                        label="Tema"
                        name="tema"
                        value={rphDetails.tema}
                        onChange={handleChange}
                        style={{ margin: '10px' }}
                        fullWidth
                    />
                    <TextField
                        label="Tunjang Utama"
                        name="tunjang_utama"
                        value={rphDetails.tunjang_utama}
                        onChange={handleChange}
                        style={{ margin: '10px' }}
                        fullWidth
                        select
                        SelectProps={{ native: true }}
                    >
                        <option value="">Tunjang Utama</option>
                                    {tunjangUtama.map(tunjang => (
                                        <option key={tunjang.tunjang_id} value={tunjang.tunjang_name}>{tunjang.tunjang_name}</option>
                                    ))}
                    </TextField>
                    <TextField
                        label="Fokus"
                        name="fokus"
                        value={rphDetails.fokus}
                        onChange={handleChange}
                        style={{ margin: '10px' }}
                        fullWidth
                        select
                        SelectProps={{ native: true }}
                    >
                    <option value="">Fokus</option>
                    {fokus.map(fokusItem => (
                        <option key={fokusItem.fokus_id} value={fokusItem.fokus_name}>{fokusItem.fokus_name}</option>
                    ))}
                    </TextField>
                    <TextField
                        label="Standard Kandungan"
                        name="standard_kandungan"
                        value={rphDetails.standard_kandungan}
                        onChange={handleChange}
                        style={{ margin: '10px' }}
                        fullWidth
                        select
                        SelectProps={{ native: true }}
                    >
                    <option value="">Standard Kandungan</option>
                    {standardKandungan.map(sk => (
                        <option key={sk.std_kandungan_id} value={sk.std_kandungan_name}>{sk.std_kandungan_name}</option>
                    ))}
                </TextField>
                    <TextField
                        label="Standard Pembelajaran"
                        name="standard_pembelajaran"
                        value={rphDetails.standard_pembelajaran}
                        onChange={handleChange}
                        style={{ margin: '10px' }}
                        fullWidth
                        select
                        SelectProps={{ native: true }}
                    >
                    <option value="">Standard Pembelajaran</option>
                    {standardPembelajaran.map(sp => (
                        <option key={sp.std_pembelajaran_id} value={sp.std_pembelajaran_name}>{sp.std_pembelajaran_name}</option>
                    ))}
                </TextField>
                    <TextField
                        label="Kesepaduan Tunjang"
                        name="kesepaduan_tunjang"
                        value={rphDetails.kesepaduan_tunjang}
                        onChange={handleChange}
                        style={{ margin: '10px' }}
                        fullWidth
                        select
                        SelectProps={{ native: true }}
                    >
                    <option value="">Kesepaduan Tunjang</option>
                    {kesepaduanTunjang.map(kt => (
                        <option key={kt.tunjang_id} value={kt.tunjang_name}>{kt.tunjang_name}</option>
                    ))}
                </TextField>
                    <TextField
                        label="Pengetahuan Sedia Ada"
                        name="pengetahuan_sedia_ada"
                        value={rphDetails.pengetahuan_sedia_ada}
                        onChange={handleChange}
                        style={{ margin: '10px' }}
                        fullWidth
                    />
                    <TextField
                        label="Objektif Pembelajaran"
                        name="objektif_pembelajaran"
                        value={rphDetails.objektif_pembelajaran}
                        onChange={handleChange}
                        style={{ margin: '10px' }}
                        fullWidth
                    />
                    <TextField
                        label="Hasil Pembelajaran"
                        name="hasil_pembelajaran"
                        value={rphDetails.hasil_pembelajaran}
                        onChange={handleChange}
                        style={{ margin: '10px' }}
                        fullWidth
                    />
                    <TextField
                        label="Bahan Bantu Mengajar (BBM)"
                        name="bahan_bantu_mengajar"
                        value={rphDetails.bahan_bantu_mengajar}
                        onChange={handleChange}
                        style={{ margin: '10px' }}
                        fullWidth
                    />
                    <TextField
                        label="Kemahiran Berfikir (KBAT)"
                        name="kemahiran_berfikir"
                        value={rphDetails.kemahiran_berfikir}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '45%' }}
                        select
                        SelectProps={{ native: true }}
                    >
                    <option value="">KBAT</option>
                    <option value="Menganalisis">Menganalisis</option>
                    <option value="Mengaplikasi">Mengaplikasi</option>
                    <option value="Mencipta">Mencipta</option>
                    <option value="Menilai">Menilai</option>
                </TextField>
                    <TextField
                        label="Penerapan Nilai"
                        name="penerapan_nilai"
                        value={rphDetails.penerapan_nilai}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '45%' }}
                        select
                        SelectProps={{ native: true }}
                    >
                    <option value="">Penarapan Nilai</option>
                    {penerapanNilai.map(pn => (
                        <option value={pn.penerapan_nilai_name}>{pn.penerapan_nilai_name}</option>
                    ))}
                </TextField>
                    <TextField
                        label="Aktiviti"
                        name="aktiviti"
                        value={rphDetails.aktiviti}
                        onChange={handleChange}
                        style={{ margin: '10px' }}
                        fullWidth
                    />
                    <TextField
                        label="Refleksi"
                        name="refleksi"
                        value={rphDetails.refleksi}
                        onChange={handleChange}
                        style={{ margin: '10px' }}
                        fullWidth
                    />
                </Box>

                <Box display="flex" justifyContent="center" mt="20px">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdate}
                        sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontSize: "14px", fontWeight: "bold", padding: "10px 20px" }}
                    >
                        Update RPH
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default UpdateRPH;
