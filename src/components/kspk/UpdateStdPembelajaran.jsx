import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup"; 
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../Header";
import { Link } from 'react-router-dom';

const UpdateStdPembelajaran = () => {
    const { stdPembelajaranId } = useParams();
    const history = useNavigate();
    const [stdPembelajaran, setStdPembelajaran] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stdKandungan, setFokus] = useState([]);
    const validationSchema = yup.object().shape({
        std_pembelajaran_name: yup.string().required("Standard Pembelajaran name is required"),
        std_pembelajaran_code: yup.string().required("Standard Pembelajaran code is required"),
        std_kandungan_id: yup.string().required("Standard Kandungan is required"),
    });

    // Fetch Fokus data when component mounts
    useEffect(() => {
        const fetchFokus = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/std-kandungan/');
                setFokus(response.data);
            } catch (error) {
                console.error('Error fetching std kandungan data:', error);
            }
        };
        
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/std-pembelajaran/${stdPembelajaranId}/`);
                setStdPembelajaran(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
        fetchFokus();
    }, [stdPembelajaranId]);

    // Handle form submission
    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/std-pembelajaran/${stdPembelajaranId}/`, values);
            console.log(response.data);
            alert("Standard Pembelajaran updated successfully!");
            history('/settings/kspk'); // Redirect to Settings page
        } catch (error) {
            console.error('Error updating Standard Pembelajaran:', error);
            alert("Error updating Standard Pembelajaran. Please try again later.");
        }
        setSubmitting(false);
    };

    return (
        <Box>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : stdPembelajaran ? (
            <Box>
              <Box m="10px 0 0 20px">
                {/* Breadcrumb with session name */}
                <Breadcrumbs aria-label="breadcrumb">
                  <Link component={RouterLink} to="/settings/kspk" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Settings
                  </Link>
                  <Typography color="text.primary">Kemaskini Standard Pembelajaran {stdPembelajaran.std_pembelajaran_name}</Typography>
                </Breadcrumbs>
              </Box>
              <Box m="0 20px 0px 20px">
                <Header title="STANDARD PEMBELAJARAN" subtitle="Kemaskini Standard Pembelajaran" />
                <Box boxShadow={15} p="10px" mt="20px">
                <Formik
                  initialValues={stdPembelajaran}
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
                  }) => (
                    <form onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        id="std_pembelajaran_name"
                        label="Nama Standard Pembelajaran"
                        name="std_pembelajaran_name"
                        value={values.std_pembelajaran_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.std_pembelajaran_name && Boolean(errors.std_pembelajaran_name)}
                        helperText={touched.std_pembelajaran_name && errors.std_pembelajaran_name}
                        style={{ margin: '20px', width: '95%' }}
                    />
                    <TextField
                        variant="outlined"
                        id="std_pembelajaran_code"
                        label="Kod Standard Pembelajaran"
                        name="std_pembelajaran_code"
                        value={values.std_pembelajaran_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.std_pembelajaran_code && Boolean(errors.std_pembelajaran_code)}
                        helperText={touched.std_pembelajaran_code && errors.std_pembelajaran_code}
                        style={{ margin: '20px', width: '95%' }}
                    />
                    <TextField
                        variant="outlined"
                        id="std_pembelajaran_desc"
                        name="std_pembelajaran_desc"
                        label="Penerangan Standard Pembelajaran"
                        value={values.std_pembelajaran_desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.std_pembelajaran_desc && Boolean(errors.std_pembelajaran_desc)}
                        helperText={touched.std_pembelajaran_desc && errors.std_pembelajaran_desc}
                        style={{ margin: '20px', width: '95%' }}
                    />
                    <TextField
                        label="Standard Kandungan"
                        name="std_kandungan_id"
                        select
                        value={values.std_kandungan_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.std_kandungan_id && Boolean(errors.std_kandungan_id)}
                        helperText={touched.std_kandungan_id && errors.std_kandungan_id}
                        style={{ margin: '20px', width: '95%' }}
                        SelectProps={{ native: true }}
                    >
                        <option value="">Standard Kandungan</option>
                        {stdKandungan.map(std_kandungan => (
                            <option key={std_kandungan.std_kandungan_id} value={std_kandungan.std_kandungan_id}>{std_kandungan.std_kandungan_name}</option>
                        ))}
                    </TextField>
                      {/* Submit Button */}
                      <Box display="flex" justifyContent="end" m="20px">
                        <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                          {isSubmitting ? 'Submitting...' : 'Kemaskini'}
                        </Button>
                        {/* Cancel Button */}
                        <Button
                          color="error"
                          variant="contained"
                          style={{ marginLeft: '10px' }}
                          onClick={() => history('/settings/kspk')}
                        >
                          Batal
                        </Button>
                      </Box>
                    </form>
                  )}
                </Formik>
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography>Standard Pembelajaran not found.</Typography>
          )}
        </Box>
      );
};

export default UpdateStdPembelajaran;