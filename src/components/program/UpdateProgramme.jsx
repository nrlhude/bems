// frontend/src/components/Update/UpdateProgram.jsx

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../Header";
import { Link } from 'react-router-dom';

const UpdateProgram = () => {
  const { programId } = useParams(); // Get the program ID from the URL params
  const navigate = useNavigate(); // Use useNavigate to redirect user to another page

  const [program, setProgram] = useState(null); // State to store the program data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Define validation schema for form fields
  const validationSchema = yup.object().shape({
    programme_name: yup.string().required("Program name is required"),
    programme_code: yup.string().required("Program code is required"),
    programme_desc: yup.string().required("Program description is required"),
    programme_status: yup.string().required("Program status is required"),
  });

  // Fetch program data when component mounts
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/programmes/${programId}/`);
        setProgram(response.data); // Set program data to state
      } catch (error) {
        console.error('Error fetching program:', error);
        setError('Error fetching program data.');
        
      } finally {
        setLoading(false); // Set loading to false after data is fetched or in case of error
      }
    };
    fetchProgram();
  }, [programId]); // Fetch program data whenever programId changes

  // Handle form submission
  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
        // Make API call to update program
        const response = await axios.put(`http://127.0.0.1:8000/api/programmes/${programId}/`, values);
        console.log(response.data);
        // Handle success, e.g., redirect to another page
        alert("Program updated successfully!");
        navigate('/settings/programs'); // Redirect to Settings page
    } catch (error) {
        console.error('Error updating program:', error);
        // Handle error, e.g., display error message to the user
        alert("Error updating program. Please try again later.");
    } finally {
        setSubmitting(false);
    }

  };

  if (loading) return <Typography>Loading...</Typography>;

  if (error) return <Typography>{error}</Typography>;

  return (
    <Box>
      {program ? (
        <Box>
          <Box m="10px 0 0 20px">
            {/* Breadcrumb with program name */}
            <Breadcrumbs aria-label="breadcrumb">
              <Link component={RouterLink} to="/settings/programs" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Settings
              </Link>
              <Typography color="text.primary">Update Program {program.programme_name}</Typography>
            </Breadcrumbs>
          </Box>
          <Box m="0 20px 0px 20px">
            {/* Header with program name as title */}
            <Header title="KEMASKINI PROGRAM" subtitle="Kemaskini Maklumat Program" />
            {/* Formik form for updating program */}
            <Box boxShadow={15} p="10px" mt="20px">
              <Formik
                initialValues={program}
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
                    {/* Program Name */}
                    <TextField
                      variant="outlined"
                      type="text"
                      label="Program Name"
                      name="programme_name"
                      value={values.programme_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.programme_name && !!errors.programme_name}
                      helperText={touched.programme_name && errors.programme_name}
                      style={{ margin: '20px', width: '95%' }}
                    />
                    {/* Program Code */}
                    <TextField
                      variant="outlined"
                      type="text"
                      label="Program Code"
                      name="programme_code"
                      value={values.programme_code}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.programme_code && !!errors.programme_code}
                      helperText={touched.programme_code && errors.programme_code}
                      style={{ margin: '20px', width: '95%' }}
                    />
                    {/* Program Description */}
                    <TextField
                      variant="outlined"
                      type="text"
                      label="Program Description"
                      name="programme_desc"
                      value={values.programme_desc}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.programme_desc && !!errors.programme_desc}
                      helperText={touched.programme_desc && errors.programme_desc}
                      style={{ margin: '20px', width: '95%' }}
                    />
                    {/* Program Status */}
                    <FormControl variant="outlined" style={{ margin: '20px', width: '95%' }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        label="Program Status"
                        name="programme_status"
                        value={values.programme_status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.programme_status && !!errors.programme_status}
                      >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="Aktif">Aktif</MenuItem>
                        <MenuItem value="Tidak Aktif">Tidak Aktif</MenuItem>
                      </Select>
                    </FormControl>
                    {/* Submit Button */}
                    <Box display="flex" justifyContent="end" mt="20px">
                      <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Update'}
                      </Button>
                      {/* Cancel Button */}
                      <Button
                        color="error"
                        variant="contained"
                        style={{ marginLeft: '10px' }}
                        onClick={() => navigate('/settings/programs')}
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
        <Typography>Program not found.</Typography>
      )}
    </Box>
  );
};

export default UpdateProgram;
