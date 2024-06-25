import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../Header";
import { Link } from 'react-router-dom';

// `http://127.0.0.1:8000/api/tunjang-utama/${tunjangId}/`
// history('/settings/kspk');
const UpdateTunjangUtama = () => {
    const { tunjangId } = useParams();
    const history = useNavigate();
    const [kspk, setKSPK] = useState(null);
    const [loading, setLoading] = useState(true); 

    const validationSchema = yup.object().shape({
        tunjang_name: yup.string().required("Tunjang name is required"),
    });

    // Fetch KSPK data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/tunjang-utama/${tunjangId}/`);
                setKSPK(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [tunjangId]);

    // Handle form submission
  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
    const response = await axios.put(`http://127.0.0.1:8000/api/tunjang-utama/${tunjangId}/`, values);
      console.log(response.data);
      alert("Tunjang Utama updated successfully!");
      history('/settings/kspk'); // Redirect to Settings page
    } catch (error) {
      console.error('Error updating tunjang utama:', error);
      alert("Error updating tunjang utama. Please try again later.");
    }
    setSubmitting(false);
  };

  return (
    <Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : kspk ? (
        <Box>
          <Box m="10px 0 0 20px">
            {/* Breadcrumb with session name */}
            <Breadcrumbs aria-label="breadcrumb">
              <Link component={RouterLink} to="/settings/kspk" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Settings
              </Link>
              <Typography color="text.primary">Kemaskini Tunjang Utama {kspk.tunjang_name}</Typography>
            </Breadcrumbs>
          </Box>
          <Box m="0 20px 0px 20px">
            <Header title="TUNJANG UTAMA" subtitle="Kemaskini Tunjang Utama" />
            <Box boxShadow={15} p="10px" mt="20px">
            <Formik
              initialValues={kspk}
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
                    label="Nama Tunjang Utama"
                    name="tunjang_name"
                    value={values.tunjang_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.tunjang_name && Boolean(errors.tunjang_name)}
                        helperText={touched.tunjang_name && errors.tunjang_name}
                    style={{ margin: '20px' , width: '95%'}}
                  />
                  <TextField
                        type="text"
                        name="tunjang_code"
                        label="Kod Tunjang Utama"
                        value={values.tunjang_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.tunjang_code && Boolean(errors.tunjang_code)}
                        helperText={touched.tunjang_code && errors.tunjang_code}
                        variant="outlined"
                        style={{ margin: '20px' , width: '95%'}}
                  />

                  <TextField
                    variant="outlined"
                    type="text"
                    name="tunjang_desc"
                    label="Penerangan Tunjang Utama"
                    value={values.tunjang_desc}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.tunjang_desc && Boolean(errors.tunjang_desc)}
                    helperText={touched.tunjang_desc && errors.tunjang_desc}
                    style={{ margin: '20px' , width: '95%'}}
                  />

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
        <Typography>Tunjang Utama not found.</Typography>
      )}
    </Box>
  );
};

export default UpdateTunjangUtama;



