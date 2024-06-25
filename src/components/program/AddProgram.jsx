/* 
class Programme(models.Model):
    programme_id = models.AutoField(primary_key=True)
    programme_name = models.CharField(max_length=255)
    programme_code = models.CharField(max_length=255)
    programme_desc = models.TextField()
    programme_status = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.programme_name


router.register(r'programmes', ProgrammeView, basename="programme")

*/

// Path: server/frontend/src/components/Add/AddProgram.jsx

import React from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

const AddProgram = () => { 
    const isNonMobile = useMediaQuery("(min-width:600px)");
    
    // Use useHistory to redirect user to another page
    const history = useNavigate();
    
    // Define validation schema for form fields
    const validationSchema = yup.object().shape({
        programme_name: yup.string().required("Programme name is required"),
        programme_code: yup.string().required("Programme code is required"),
        programme_desc: yup.string().required("Programme description is required"),
        programme_status: yup.string().required("Programme status is required"),
    });
    
    // Initial values for form fields
    const initialValues = {
        programme_name: "",
        programme_code: "",
        programme_desc: "",
        programme_status: "",
    };
    
    // Handle form submission
    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
        // Make API call to create new programme
        const response = await axios.post('http://127.0.0.1:8000/api/programmes/', values);

        console.log(response.data);
        // Handle success, e.g., redirect to another page
        alert("Programme created successfully!");
        history('/settings/programs');
        } catch (error) {
        console.error('Error creating programme:', error);
        // Handle error, e.g., display error message to the user
        alert("Error creating programme. Please try again later.");
        }
        setSubmitting(false);
    };

    return (
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to="/settings/programs" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Settings
                </Link>
                <Typography color="text.primary">Program</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0px 20px">
                <Header title="PROGRAM" subtitle="Tambah Program Baru" />
                <Box boxShadow={15} p="10px" mt="20px">
                {/* Formik form */}
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
                }) => (
                    <form onSubmit={handleSubmit}>
                    {/* Programme Name */}
                    <TextField
                        fullWidth
                        id="programme_name"
                        name="programme_name"
                        label="Nama Program"
                        value={values.programme_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.programme_name && Boolean(errors.programme_name)}
                        helperText={touched.programme_name && errors.programme_name}
                        variant="outlined"
                        margin="normal"
                    />

                    {/* Programme Code */}
                    <TextField
                        fullWidth
                        id="programme_code"
                        name="programme_code"
                        label="Kod Program"
                        value={values.programme_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.programme_code && Boolean(errors.programme_code)}
                        helperText={touched.programme_code && errors.programme_code}
                        variant="outlined"
                        margin="normal"
                    />

                    {/* Programme Description */}
                    <TextField
                        fullWidth
                        id="programme_desc"
                        name="programme_desc"
                        label="Penerangan Program"
                        value={values.programme_desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.programme_desc && Boolean(errors.programme_desc)}
                        helperText={touched.programme_desc && errors.programme_desc}
                        variant="outlined"
                        margin="normal"
                    />

                    {/* Programme Status */}
                    <TextField
                        fullWidth
                        variant="outlined"
                        select
                        id="programme_status"
                                name="programme_status"
                                label="Status Program"
                        value={values.programme_status}
                        margin="normal"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.programme_status && Boolean(errors.programme_status)}
                        helperText={touched.programme_status && errors.programme_status}
                        SelectProps={{
                        native: true,
                        }}
                    >
                        <option value="">Select</option>
                        <option value="Aktif">Aktif</option>
                        <option value="Tidak Aktif">Tidak Aktif</option>
                        
                    </TextField>

                    {/* Submit Button */}
                    <Box display="flex" justifyContent="end" mt="20px">
                        <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Hantar'}
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

export default AddProgram;
    
