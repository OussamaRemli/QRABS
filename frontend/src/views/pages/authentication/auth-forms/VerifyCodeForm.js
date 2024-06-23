import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Typography
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';

const VerifyCodeForm = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state ? location.state.email : ''; // Get email from location state

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      // Verify the code and update password
      const response = await axios.post(

          `${process.env.REACT_APP_SPRING_BASE_URL}/api/professors/verify-code`,
        { email, verificationCode: values.code, newPassword: values.password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        console.log('Password updated successfully!');
        navigate('/'); // Navigate to home page after successful password update
      } else {
        throw new Error(response.data.message || 'Failed to update password');
      }
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      if (err.response && err.response.status === 400) {
        setErrors({ submit: 'Invalid verification code or password' }); // Custom error message
      } else {
        setErrors({ submit: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        code: '',
        password: '',
        confirmPassword: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        code: Yup.string().required('Code is required').length(6, 'Code must be exactly 6 characters'),
        password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <FormControl fullWidth error={Boolean(touched.code && errors.code)} sx={{ ...theme.typography.customInput, mt: 2 }}>
            <InputLabel htmlFor="outlined-adornment-code">Verification Code</InputLabel>
            <OutlinedInput
              id="outlined-adornment-code"
              type="text"
              value={values.code}
              name="code"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Verification Code"
              inputProps={{ maxLength: 6 }}
            />
            {touched.code && errors.code && (
              <FormHelperText error>{errors.code}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput, mt: 2 }}>
            <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type="password"
              value={values.password}
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              label="New Password"
            />
            {touched.password && errors.password && (
              <FormHelperText error>{errors.password}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth error={Boolean(touched.confirmPassword && errors.confirmPassword)} sx={{ ...theme.typography.customInput, mt: 2 }}>
            <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm New Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-confirm-password"
              type="password"
              value={values.confirmPassword}
              name="confirmPassword"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Confirm New Password"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <FormHelperText error>{errors.confirmPassword}</FormHelperText>
            )}
          </FormControl>

          {errors.submit && (
            <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {errors.submit}
            </Typography>
          )}

          <Box sx={{ mt: 2 }}>
            <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
              Update Password
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default VerifyCodeForm;
