// frontend/src/components/rph/AddRPH.jsx

import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddRPH = () => {
    const navigate = useNavigate();
    const [kelasEnrolment, setKelasEnrolment] = useState([]);
    const [tunjangUtama, setTunjangUtama] = useState([]);
    const [fokus, setFokus] = useState([]);
    const [standardKandungan, setStandardKandungan] = useState([]);
    const [standardPembelajaran, setStandardPembelajaran] = useState([]);
    const [kesepaduanTunjang, setKesepaduanTunjang] = useState([]);
    const [penerapanNilai, setPenerapanNilai] = useState([]);
    const [schoolSession, setSchoolSession] = useState([]);

    useEffect(() => {
        const fetchKelas = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/kelass/');
                setKelasEnrolment(response.data);
            } catch (error) {
                console.error('Error fetching kelas data:', error);
            }
        };
        const fetchSchoolSession = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
                setSchoolSession(response.data);
            } catch (error) {
                console.error('Error fetching school session data:', error);
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
        fetchSchoolSession();
        fetchTunjangUtama();
        fetchFokus();
        fetchStandardKandungan();
        fetchStandardPembelajaran();
        fetchKesepaduanTunjang();
        fetchPenerapanNilai();
    }, []);

    const validationSchema = yup.object().shape({
        tarikh: yup.date().required("Tarikh is required"),
        masa: yup.string().required("Masa is required"),
        kelas: yup.string().required("Kelas is required"),
        session_id: yup.string().required("Sesi Persekolahan is required"),
        tajuk: yup.string().required("Tajuk is required"),
    });

    const initialValues = {
        tarikh: "",
        masa: "",
        bilangan_murid: 0,
        kelas: "",
        tajuk: "",
        tema: "",
        tunjang_utama: "",
        fokus: "",
        standard_kandungan: "",
        standard_pembelajaran: "",
        kesepaduan_tunjang: "",
        pengetahuan_sedia_ada: "",
        objektif_pembelajaran: "",
        hasil_pembelajaran: "",
        bahan_bantu_mengajar: "",
        penerapan_nilai: "",
        aktiviti: "",
        refleksi: "",
        session_id: "",
        // lampiran: null,
    };

    const currentUser = localStorage.getItem('user_id');
    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            const data = {
                ...values,
                created_by: currentUser,
            };
            const response = await axios.post('http://127.0.0.1:8000/api/rph/', data);
            console.log('RPH created:', response.data);
            alert("RPH created successfully!");
            navigate('/rph');
        } catch (error) {
            console.error('Error creating RPH:', error.response?.data || error.message);
            alert("Error creating RPH. Please try again later.");
        }
        setSubmitting(false);
    };

    return (
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/rph" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Rutin Pengajaran Harian (RPH)
                    </Link>
                    <Typography color="text.primary">Tambah RPH</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0 20px">
                <Header title="TAMBAH RPH" subtitle="Tambah RPH Baru" />

                <Box boxShadow={15} p="10px" mt="20px">
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
                            setFieldValue,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    label="Tarikh"
                                    name="tarikh"
                                    type="date"
                                    value={values.tarikh}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.tarikh && Boolean(errors.tarikh)}
                                    helperText={touched.tarikh && errors.tarikh}
                                    style={{ margin: '10px', width: '20%' }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Masa"
                                    name="masa"
                                    type="time"
                                    value={values.masa}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.masa && Boolean(errors.masa)}
                                    helperText={touched.masa && errors.masa}
                                    style={{ margin: '10px', width: '20%' }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Bilangan Murid"
                                    name="bilangan_murid"
                                    type="number"
                                    value={values.bilangan_murid}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.bilangan_murid && Boolean(errors.bilangan_murid)}
                                    helperText={touched.bilangan_murid && errors.bilangan_murid}
                                    style={{ margin: '10px', width: '10%' }}
                                />
                                <TextField
                                    label="Kelas"
                                    name="kelas" 
                                    select
                                    value={values.kelas}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.kelas && Boolean(errors.kelas)}
                                    helperText={touched.kelas && errors.kelas}
                                    style={{ margin: '10px', width: '20%' }}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">Kelas</option>
                                    {kelasEnrolment.map(kelas => (
                                        <option key={kelas.kelas} value={kelas.kelas_name}>{kelas.kelas_name}</option>
                                    ))}
                                </TextField>
                                    
                                <TextField
                                    label="Sesi Persekolahan"
                                    name="session_id" 
                                    select
                                    value={values.session_id}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.session_id && Boolean(errors.session_id)}
                                    helperText={touched.session_id && errors.session_id}
                                    style={{ margin: '10px', width: '20%' }}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">Sesi Persekolahan</option>
                                    {schoolSession.map(sesi => (
                                        <option key={sesi.session_id} value={sesi.session_id}>{sesi.session_name}</option>
                                    ))}
                                </TextField>

                                <TextField
                                    label="Tajuk"
                                    name="tajuk"
                                    value={values.tajuk}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.tajuk && Boolean(errors.tajuk)}
                                    helperText={touched.tajuk && errors.tajuk}
                                    style={{ margin: '10px', width: '47.5%' }}
                                />
                                <TextField
                                    label="Tema"
                                    name="tema"
                                    value={values.tema}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.tema && Boolean(errors.tema)}
                                    helperText={touched.tema && errors.tema}
                                    style={{ margin: '10px', width: '47.5%' }}
                                />
                                <TextField
                                    label="Tunjang Utama"
                                    name="tunjang_utama"
                                    select
                                    value={values.tunjang_utama}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.tunjang_utama && Boolean(errors.tunjang_utama)}
                                    helperText={touched.tunjang_utama && errors.tunjang_utama}
                                    
                                    style={{ margin: '10px', width: '47.5%' }}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">Tunjang Utama</option>
                                    {tunjangUtama.map(tunjang => (
                                        <option key={tunjang.tunjang_id} value={tunjang.tunjang_name}>{tunjang.tunjang_name}</option>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Kesepaduan Tunjang"
                                    name="kesepaduan_tunjang"
                                    select
                                    value={values.kesepaduan_tunjang}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.kesepaduan_tunjang && Boolean(errors.kesepaduan_tunjang)}
                                    helperText={touched.kesepaduan_tunjang && errors.kesepaduan_tunjang}
                                    style={{ margin: '10px', width: '47.5%' }}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">Kesepaduan Tunjang</option>
                                    {kesepaduanTunjang.map(kt => (
                                        <option key={kt.tunjang_id} value={kt.tunjang_name}>{kt.tunjang_name}</option>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Fokus"
                                    name="fokus"
                                    select
                                    value={values.fokus}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.fokus && Boolean(errors.fokus)}
                                    helperText={touched.fokus && errors.fokus}
                                    fullWidth
                                    margin="normal"
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
                                    select
                                    value={values.standard_kandungan}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.standard_kandungan && Boolean(errors.standard_kandungan)}
                                    helperText={touched.standard_kandungan && errors.standard_kandungan}
                                    fullWidth
                                    margin="normal"
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
                                    select
                                    value={values.standard_pembelajaran}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.standard_pembelajaran && Boolean(errors.standard_pembelajaran)}
                                    helperText={touched.standard_pembelajaran && errors.standard_pembelajaran}
                                    fullWidth
                                    margin="normal"
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">Standard Pembelajaran</option>
                                    {standardPembelajaran.map(sp => (
                                        <option key={sp.std_pembelajaran_id} value={sp.std_pembelajaran_name}>{sp.std_pembelajaran_name}</option>
                                    ))}
                                </TextField>
                                
                                <TextField
                                    label="Pengetahuan Sedia Ada"
                                    name="pengetahuan_sedia_ada"
                                    value={values.pengetahuan_sedia_ada}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.pengetahuan_sedia_ada && Boolean(errors.pengetahuan_sedia_ada)}
                                    helperText={touched.pengetahuan_sedia_ada && errors.pengetahuan_sedia_ada}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Objektif Pembelajaran"
                                    name="objektif_pembelajaran"
                                    value={values.objektif_pembelajaran}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.objektif_pembelajaran && Boolean(errors.objektif_pembelajaran)}
                                    helperText={touched.objektif_pembelajaran && errors.objektif_pembelajaran}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Hasil Pembelajaran"
                                    name="hasil_pembelajaran"
                                    value={values.hasil_pembelajaran}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.hasil_pembelajaran && Boolean(errors.hasil_pembelajaran)}
                                    helperText={touched.hasil_pembelajaran && errors.hasil_pembelajaran}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Bahan Bantu Mengajar (BBM)"
                                    name="bahan_bantu_mengajar"
                                    value={values.bahan_bantu_mengajar}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.bahan_bantu_mengajar && Boolean(errors.bahan_bantu_mengajar)}
                                    helperText={touched.bahan_bantu_mengajar && errors.bahan_bantu_mengajar}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Kemahiran Berfikir (KBAT)"
                                    name="kbat"
                                    select
                                    value={values.kbat}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.kbat && Boolean(errors.kbat)}
                                    helperText={touched.kbat && errors.kbat}
                                    fullWidth
                                    margin="normal"
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
                                    select
                                    value={values.penerapan_nilai}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    margin="normal"
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
                                    value={values.aktiviti}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.aktiviti && Boolean(errors.aktiviti)}
                                    helperText={touched.aktiviti && errors.aktiviti}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Refleksi"
                                    name="refleksi"
                                    value={values.refleksi}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.refleksi && Boolean(errors.refleksi)}
                                    helperText={touched.refleksi && errors.refleksi}
                                    fullWidth
                                    margin="normal"
                                />
                                {/* <TextField
                                    label="Lampiran"
                                    name="lampiran"
                                    type="file"
                                    onChange={(event) => setFieldValue("lampiran", event.currentTarget.files[0])}
                                    onBlur={handleBlur}
                                    error={touched.lampiran && Boolean(errors.lampiran)}
                                    helperText={touched.lampiran && errors.lampiran}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                /> */}
                                <Box display="flex" justifyContent="flex-end" mt="20px">
                                    <Button type="submit" color="primary" variant="contained" disabled={isSubmitting}>
                                        Submit
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Box>
        </Box>
    );
};

export default AddRPH;
