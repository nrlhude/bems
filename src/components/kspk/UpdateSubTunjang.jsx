import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../Header";
import { Link } from 'react-router-dom';

// `http://127.0.0.1:8000/api/sub-tunjang/${subtunjangId}/`
// history('/settings/kspk');
const UpdateSubTunjang = () => {
    const { subtunjangId } = useParams();
    const history = useNavigate();
    const [kspk, setKSPK] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [tunjangUtama, setTunjangUtama] = useState([]);
    const validationSchema = yup.object().shape({
        subtunjang_name: yup.string().required("Subtunjang name is required"),
    });

    // Fetch KSPK data when component mounts
    useEffect(() => {
      const fetchTunjangUtama = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/tunjang-utama/');
            setTunjangUtama(response.data);
        } catch (error) {
            console.error('Error fetching tunjang utama data:', error);
        }
    };
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/sub-tunjang/${subtunjangId}/`);
                setKSPK(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
        fetchTunjangUtama();
    }, [subtunjangId]);

    // Handle form submission
  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
    const response = await axios.put(`http://127.0.0.1:8000/api/sub-tunjang/${subtunjangId}/`, values);
      console.log(response.data);
      alert("Sub Tunjang updated successfully!");
      history('/settings/kspk'); // Redirect to Settings page
    } catch (error) {
      console.error('Error updating Sub Tunjang:', error);
      alert("Error updating Sub Tunjang. Please try again later.");
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
              <Typography color="text.primary">Kemaskini Sub Tunjang {kspk.tunjang_name}</Typography>
            </Breadcrumbs>
          </Box>
          <Box m="0 20px 0px 20px">
            <Header title="SUB TUNJANG" subtitle="Kemaskini Sub Tunjang" />
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
                    label="Nama Sub Tunjang"
                    name="subtunjang_name"
                    value={values.subtunjang_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.subtunjang_name && Boolean(errors.subtunjang_name)}
                    helperText={touched.subtunjang_name && errors.subtunjang_name}
                    style={{ margin: '20px' , width: '95%'}}
                  />
                  <TextField
                      variant="outlined"
                      type="text"
                      label="Kod Sub Tunjang"
                      name="subtunjang_code"
                      value={values.subtunjang_code}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.subtunjang_code && Boolean(errors.subtunjang_code)}
                      helperText={touched.subtunjang_code && errors.subtunjang_code}
                      style={{ margin: '20px', width: '95%' }}
                  />
                  <TextField
                    variant="outlined"
                    type="text"
                    label="Penerangan Sub Tunjang"
                    name="subtunjang_desc"
                    value={values.subtunjang_desc}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.subtunjang_desc && Boolean(errors.subtunjang_desc)}
                    helperText={touched.subtunjang_desc && errors.subtunjang_desc}
                    style={{ margin: '20px' , width: '95%'}}
                  />
                  <TextField
                      label="Tunjang Utama"
                      name="tunjang_id"
                      select
                      value={values.tunjang_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.tunjang_id && Boolean(errors.tunjang_id)}
                      helperText={touched.tunjang_id && errors.tunjang_id}
                      style={{ margin: '20px', width: '95%' }}
                      SelectProps={{ native: true }}
                  >
                      <option value="">Tunjang Utama</option>
                      {tunjangUtama.map(tunjang => (
                          <option key={tunjang.tunjang_id} value={tunjang.tunjang_id}>{tunjang.tunjang_name}</option>
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
        <Typography>Sub Tunjang not found.</Typography>
      )}
    </Box>
  );
};

export default UpdateSubTunjang;



