import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../Header";
import { Link } from 'react-router-dom';

// http://127.0.0.1:8000/api/std-kandungan/${stdKandunganId}
// history('/settings/kspk');

const UpdateStdKandungan = () => {
    const { stdKandunganId } = useParams();
    const history = useNavigate();
    const [stdKandungan, setStdKandungan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fokus, setFokus] = useState([]);
    const validationSchema = yup.object().shape({
        std_kandungan_name: yup.string().required("Standard Kandungan name is required"),
        std_kandungan_code: yup.string().required("Standard Kandungan code is required"),
        fokus_id: yup.string().required("Fokus is required"),
    });

    // Fetch Fokus data when component mounts
    useEffect(() => {
        const fetchFokus = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/fokus/');
                setFokus(response.data);
            } catch (error) {
                console.error('Error fetching fokus data:', error);
            }
        };
        
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/std-kandungan/${stdKandunganId}/`);
                setStdKandungan(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
        fetchFokus();
    }, [stdKandunganId]);

    // Handle form submission
    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/std-kandungan/${stdKandunganId}/`, values);
            console.log(response.data);
            alert("Standard Kandungan updated successfully!");
            history('/settings/kspk'); // Redirect to Settings page
        } catch (error) {
            console.error('Error updating Standard Kandungan:', error);
            alert("Error updating Standard Kandungan. Please try again later.");
        }
        setSubmitting(false);
    };

    return (
        <Box>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : stdKandungan ? (
            <Box>
              <Box m="10px 0 0 20px">
                {/* Breadcrumb with session name */}
                <Breadcrumbs aria-label="breadcrumb">
                  <Link component={RouterLink} to="/settings/kspk" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Settings
                  </Link>
                  <Typography color="text.primary">Kemaskini Standard Kandungan {stdKandungan.std_kandungan_name}</Typography>
                </Breadcrumbs>
              </Box>
              <Box m="0 20px 0px 20px">
                <Header title="STANDARD KANDUNGAN" subtitle="Kemaskini Standard Kandungan" />
                <Box boxShadow={15} p="10px" mt="20px">
                <Formik
                  initialValues={stdKandungan}
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
                        type="text"
                        label="Nama Standard Kandungan"
                        name="std_kandungan_name"
                        value={values.std_kandungan_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.std_kandungan_name && Boolean(errors.std_kandungan_name)}
                        helperText={touched.std_kandungan_name && errors.std_kandungan_name}
                        style={{ margin: '20px' , width: '95%'}}
                      />
                      <TextField
                          variant="outlined"
                          type="text"
                          label="Kod Standard Kandungan"
                          name="std_kandungan_code"
                          value={values.std_kandungan_code}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.std_kandungan_code && Boolean(errors.std_kandungan_code)}
                          helperText={touched.std_kandungan_code && errors.std_kandungan_code}
                          style={{ margin: '20px', width: '95%' }}
                      />
                      <TextField
                        variant="outlined"
                        type="text"
                        label="Penerangan Standard Kandungan"
                        name="std_kandungan_desc"
                        value={values.std_kandungan_desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.std_kandungan_desc && Boolean(errors.std_kandungan_desc)}
                        helperText={touched.std_kandungan_desc && errors.std_kandungan_desc}
                        style={{ margin: '20px' , width: '95%'}}
                      />
                      <TextField
                          label="Fokus"
                          name="fokus_id"
                          select
                          value={values.fokus_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.fokus_id && Boolean(errors.fokus_id)}
                          helperText={touched.fokus_id && errors.fokus_id}
                          style={{ margin: '20px', width: '95%' }}
                          SelectProps={{ native: true }}
                      >
                          <option value="">Fokus</option>
                          {fokus.map(fokus => (
                              <option key={fokus.fokus_id} value={fokus.fokus_id}>{fokus.fokus_name}</option>
                          ))}
                      </TextField>
    
    
                      
                      {/* Submit Button */}
                      <Box display="flex" justifyContent="end" mt="20px">
                        <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                          {isSubmitting ? 'Submitting...' : 'Kemaskini'}
                        </Button>
                        {/* Cancel Button */}
                        <Button
                          color="error"
                          variant="contained"
                          style={{ marginLeft: '20px' }}
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
            <Typography>Standard Kandungan not found.</Typography>
          )}
        </Box>
      );
};

export default UpdateStdKandungan;