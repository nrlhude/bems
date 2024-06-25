import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../Header";
import { Link } from 'react-router-dom';

const UpdatePenerapanNilai = () => {
    const { penerapanNilaiId } = useParams();
    const history = useNavigate();
    const [penerapan, setPenerapan] = useState(null);
    const [loading, setLoading] = useState(true);

    const validationSchema = yup.object().shape({
        penerapan_nilai_name: yup.string().required("Penerapan Nilai name is required"),
    });

    // Fetch Penerapan Nilai data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/penerapan-nilai/${penerapanNilaiId}/`);
                setPenerapan(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [penerapanNilaiId]);

    // Handle form submission
  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
    const response = await axios.put(`http://127.0.0.1:8000/api/penerapan-nilai/${penerapanNilaiId}/`, values);
      console.log(response.data);
      alert("Penerapan Nilai updated successfully!");
      history('/settings/kspk'); // Redirect to Settings page
    } catch (error) {
      console.error('Error updating penerapan nilai:', error);
      alert("Error updating penerapan nilai. Please try again later.");
    }
    setSubmitting(false);
  };

  return (
    <Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : penerapan ? (
        <Box>
          <Box m="10px 0 0 20px">
            {/* Breadcrumb with session name */}
            <Breadcrumbs aria-label="breadcrumb">
              <Link component={RouterLink} to="/settings/kspk" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Settings
              </Link>
              <Typography color="text.primary">Kemaskini Penerapan Nilai {penerapan.penerapan_nilai_name}</Typography>
            </Breadcrumbs>
          </Box>
          <Box m="0 20px 0px 20px">
          <Header title="PENERAPAN NILAI" subtitle="Kemaskini Penerapan Nilai" />
            <Box boxShadow={15} p="10px" mt="20px">
            <Formik
              initialValues={penerapan}
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
                        name="penerapan_nilai_name"
                        label="Nama Penerapan Nilai"
                        value={values.penerapan_nilai_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.penerapan_nilai_name && Boolean(errors.penerapan_nilai_name)}
                        helperText={touched.penerapan_nilai_name && errors.penerapan_nilai_name}
                        style={{ margin: '20px', width: '95%' }}
                    />
                    <TextField
                        type='text'
                        name="penerapan_nilai_desc"
                        label="Penerangan Penerapan Nilai"
                        value={values.penerapan_nilai_desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.penerapan_nilai_desc && Boolean(errors.penerapan_nilai_desc)}
                        helperText={touched.penerapan_nilai_desc && errors.penerapan_nilai_desc}
                        variant="outlined"
                        style={{ margin: '20px', width: '95%' }}
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
        <Typography>Penerapan Nilai not found.</Typography>
      )}
    </Box>
  );
};

export default UpdatePenerapanNilai;
