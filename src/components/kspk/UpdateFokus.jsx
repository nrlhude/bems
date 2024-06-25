import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../Header";
import { Link } from 'react-router-dom';

// `http://127.0.0.1:8000/api/fokus/${fokusId}/`
// history('/settings/kspk');
const UpdateFokus = () => {
    const { fokusId } = useParams();
    const history = useNavigate();
    const [kspk, setKSPK] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [subtunjang, setSubTunjang] = useState([]);
    const validationSchema = yup.object().shape({
        fokus_name: yup.string().required("Fokus name is required"),
        fokus_code: yup.string().required("Fokus code is required"),
        subtunjang_id: yup.string().required("Subtunjang is required"),
    });

    // Fetch KSPK data when component mounts
    useEffect(() => {
      const fetchSubTunjang = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/sub-tunjang/');
            setSubTunjang(response.data);
        } catch (error) {
            console.error('Error fetching subtunjang data:', error);
        }
    };
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/fokus/${fokusId}/`);
                setKSPK(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
        fetchSubTunjang();
    }, [fokusId]);

    // Handle form submission
  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
    const response = await axios.put(`http://127.0.0.1:8000/api/fokus/${fokusId}/`, values);
      console.log(response.data);
      alert("Fokus updated successfully!");
      history('/settings/kspk'); // Redirect to Settings page
    } catch (error) {
      console.error('Error updating Fokus:', error);
      alert("Error updating Fokus. Please try again later.");
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
              <Typography color="text.primary">Kemaskini Fokus {kspk.fokus_name}</Typography>
            </Breadcrumbs>
          </Box>
          <Box m="0 20px 0px 20px">
            <Header title="FOKUS" subtitle="Kemaskini Fokus" />
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
                    label="Nama Fokus"
                    name="fokus_name"
                    value={values.fokus_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fokus_name && Boolean(errors.fokus_name)}
                    helperText={touched.fokus_name && errors.fokus_name}
                    style={{ margin: '20px' , width: '95%'}}
                  />
                  <TextField
                      variant="outlined"
                      type="text"
                      label="Kod Fokus"
                      name="fokus_code"
                      value={values.fokus_code}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.fokus_code && Boolean(errors.fokus_code)}
                      helperText={touched.fokus_code && errors.fokus_code}
                      style={{ margin: '20px', width: '95%' }}
                  />
                  <TextField
                    variant="outlined"
                    type="text"
                    label="Penerangan Fokus"
                    name="fokus_desc"
                    value={values.fokus_desc}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fokus_desc && Boolean(errors.fokus_desc)}
                    helperText={touched.fokus_desc && errors.fokus_desc}
                    style={{ margin: '20px' , width: '95%'}}
                  />
                  <TextField
                      label="Sub Tunjang"
                      name="subtunjang_id"
                      select
                      value={values.subtunjang_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.subtunjang_id && Boolean(errors.subtunjang_id)}
                      helperText={touched.subtunjang_id && errors.subtunjang_id}
                      style={{ margin: '20px', width: '95%' }}
                      SelectProps={{ native: true }}
                  >
                      <option value="">Sub Tunjang</option>
                      {subtunjang.map(subtunjang => (
                          <option key={subtunjang.subtunjang_id} value={subtunjang.subtunjang_id}>{subtunjang.subtunjang_name}</option>
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
        <Typography>Fokus not found.</Typography>
      )}
    </Box>
  );
};

export default UpdateFokus;



