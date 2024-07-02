import { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Divider,
  Typography,
  useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';


// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const [checked, setChecked] = useState(true);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const parseToken = (token) => {
    if (!token) return null; // Vérifier si le token est présent
  
    const tokenParts = token.split('.'); // Diviser le token en parties
    const tokenPayload = tokenParts[1];
    
    try {
      const decodedPayload = JSON.parse(atob(tokenPayload));
      // console.log(decodedPayload.role);
      return decodedPayload.role;
    } catch (error) {
      console.error("Error parsing token payload:", error);
      return null;
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = parseToken(token);
    if (token && role === 'ROLE_PROFESSOR') {
      navigate('/dashboard/default');
    }
  }, []);
  

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);

              // Récupérer le token JWT depuis la réponse de votre API (assumant que le token est dans la réponse user)
              const response = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/professors/authenticate`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(values), // Envoyer les données de connexion au format JSON
              });
              if (response.ok) {
                const token = await response.text();
                localStorage.setItem('token', token);
                // Récupérer le rôle à partir du token JWT
                const role = parseToken(token);
                // Rediriger l'utilisateur en fonction de son rôle
                if (role === 'ROLE_PROFESSOR') {
                  navigate('/dashboard/default'); // Redirection vers la route admin
                } else{
                  throw new Error("You do not have access");
                }
                // Rediriger l'utilisateur vers la page Dashboard après la connexion réussie
                // navigate('/dashboard/default');
              } else {
                console.log("error auth!!")
                // Si la réponse n'est pas réussie, afficher une erreur
                const errorData = await response.text();
                throw new Error("Email or Password doesn't matched!");
              }
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            
              <Button
                  variant="text"
                  color="secondary"
                  onClick={() => navigate('/forgot-password')}
                  sx={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                Forgot Password?
              </Button>

            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3,textAlign: 'center'  }}>
                <FormHelperText error sx={{ fontWeight: 'bold',fontSize:'16px',textAlign:'center' }}>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
