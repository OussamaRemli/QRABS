import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    Stack,

} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';

const ForgotPasswordForm = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (values, { setErrors, setSubmitting }) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SPRING_BASE_URL}/api/professors/forgot-password?email=${values.email}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                console.log("Email sent: ", response.data);
                navigate('/verify-code', { state: { email: values.email } }); // Navigate to VerifyCode with email in state
            } else {
                throw new Error('Failed to send email');
            }
        } catch (err) {
            console.error('Request failed:', err);
            if (err.response && err.response.status === 400) {
                setErrors({ submit: 'Bad request. Please check your input.' });
            } else if (err.response && err.response.data && err.response.data.message) {
                setErrors({ submit: err.response.data.message });
            } else {
                setErrors({ submit: 'An unexpected error occurred. Please try again later.' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{
                email: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
            })}
            onSubmit={handleSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} {...others}>
                    <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-email-forgot-password">Email Address</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email-forgot-password"
                            type="email"
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Email Address"
                            inputProps={{}}
                        />
                        {touched.email && errors.email && (
                            <FormHelperText error id="standard-weight-helper-text-email-forgot-password">
                                {errors.email}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Button
                    variant="text"
                    color="secondary"
                    onClick={() => navigate('/')}
                    sx={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                    Back to sign up
                </Button>

            </Stack>
                    {errors.submit && (
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <FormHelperText error sx={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>{errors.submit}</FormHelperText>
                        </Box>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                            Send Code
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default ForgotPasswordForm;
