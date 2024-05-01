import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { Grid, Box, TextField, Typography, Snackbar, Alert, Button } from '@mui/material';
import { gridSpacing } from 'store/constant';

const Update = () => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();
    const [professorId, setProfessorId] = useState('');
    const [newProfessorFirstName, setNewProfessorFirstName] = useState('');
    const [newProfessorLastName, setNewProfessorLastName] = useState('');
    const [professorRole, setProfessorRole] = useState('');
    const [newProfessorEmail, setNewProfessorEmail] = useState('');
    const [newProfessorPassword, setNewProfessorPassword] = useState('');
    const [professorDepartmentId, setProfessorDepartmentId] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const tokenParts = token.split('.');
                    const tokenPayload = JSON.parse(atob(tokenParts[1]));
                    console.log(tokenPayload);
                    setProfessorId(parseInt(tokenPayload.id, 10));
                    setProfessorRole(tokenPayload.role);
                    setProfessorDepartmentId(parseInt(tokenPayload.departmentId, 10));
                    setNewProfessorFirstName(tokenPayload.firstName);
                    setNewProfessorLastName(tokenPayload.lastName);
                    setNewProfessorEmail(tokenPayload.sub);
                } else {
                    console.log('Aucun token trouvé dans le localStorage');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données du token:', error);
            }
        };

        fetchData();
    }, []);

    const handleProfessorupdate = async () => {
        try {
            if (!newProfessorFirstName || !newProfessorLastName || !newProfessorEmail || !newProfessorPassword) {
                throw new Error('Toutes les données requises ne sont pas fournies.');
            }

            const professorData = {
                id: professorId,
                firstName: newProfessorFirstName,
                lastName: newProfessorLastName,
                email: newProfessorEmail,
                password: newProfessorPassword,
                role: professorRole,
                department: {
                    departmentId: professorDepartmentId
                }
            };
            console.log('Nouvelles données du professeur:', professorData);
            const response = await axios.put('http://localhost:8080/api/professors', professorData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Réponse du serveur:', response);

            await navigate('/dashboard/default');
            console.log('Navigation vers le tableau de bord');

            setSnackbarSeverity('success');
            setSnackbarMessage('Mise à jour réussie');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données:', error);
            let errorMessage = 'Erreur lors de la mise à jour des données.';
            if (error.response && error.response.data) {
                errorMessage = error.response.data.message || errorMessage;
            }
            setSnackbarSeverity('error');
            setSnackbarMessage(errorMessage);
            setOpenSnackbar(true);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    if (!localStorage.getItem('token')) {
        navigate('/');
        window.location.reload();
    }

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={12} marginTop={'16px'}>
                <Grid container spacing={gridSpacing} justifyContent={'center'}>
                    <Grid item lg={4} sm={6} xs={12} md={6}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1 },
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                padding: '20px 10px',
                                width: '100%',
                                autoComplete: 'off',
                                bgcolor: '#fff',
                                borderRadius: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                border: `1px solid ${theme.palette.primary.main}`
                            }}
                            noValidate
                        >
                            <Typography variant="h4" color="primary" textAlign={'center'}>Modifier Vos Coordonnées</Typography>
                            <Grid container direction="column" justifyContent="center" spacing={0}>
                                <Grid item xs={12} lg={12}>
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex'
                                        }}
                                        marginLeft={'-16px'}
                                    >
                                    </Box>
                                </Grid>
                            </Grid>
                            <TextField id="standard-basic" label="Nom " variant="standard" value={newProfessorLastName} onChange={(e) => setNewProfessorLastName(e.target.value)} />
                            <TextField id="standardstandard-basic" label="Prénom" variant="standard" value={newProfessorFirstName} onChange={(e) => setNewProfessorFirstName(e.target.value)} />
                            <TextField id="standardstandard-basic" label="Email" standard variant="standard" value={newProfessorEmail} onChange={(e) => setNewProfessorEmail(e.target.value)} />
                            <TextField id="standard-password-input" label="Password" type="password" autoComplete="current-password" variant="standard" value={newProfessorPassword} onChange={(e) => setNewProfessorPassword(e.target.value)} />
                            <Button variant="outlined" color="primary" style={{ marginTop: '30px' }} onClick={handleProfessorupdate}>Update</Button>
                        </Box>
                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={4000}
                            onClose={handleSnackbarClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        >
                            <Alert
                                severity={snackbarSeverity}
                                onClose={handleSnackbarClose}
                                variant="filled"
                                sx={{ width: '100%' }}
                            >
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Update;
