import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SettingsPage = () => {
    const [professorData, setProfessorData] = useState({
        id: '',
        departmentId: '',
        firstName: '',
        lastName: '',
        email: '',
    });
    const [newProfessorPassword, setNewProfessorPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetPassword, setResetPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [confirmationText, setConfirmationText] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProfessorData();
    }, []);

    const fetchProfessorData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const tokenParts = token.split('.');
                const tokenPayload = JSON.parse(atob(tokenParts[1]));
                const { id, departmentId, firstName, lastName, sub: email } = tokenPayload;
                setProfessorData({ id, departmentId, firstName, lastName, email });
            } else {
                throw new Error('Token not found in localStorage');
            }
        } catch (error) {
            console.error('Error fetching professor data:', error);
            navigate('/login'); // Redirect to login page or handle error appropriately
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handlePasswordChange = (event) => {
        setNewProfessorPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleResetPasswordChange = (event) => {
        setResetPassword(event.target.value);
    };

    const handleConfirmationTextChange = (event) => {
        setConfirmationText(event.target.value);
    };

    const openResetDialog = () => {
        setOpenDialog(true);
    };

    const closeResetDialog = () => {
        setOpenDialog(false);
        setConfirmationText('');
        setResetPassword('');
    };

    const handleEmailUpdate = async () => {
        try {
            const { id, email: currentEmail } = professorData;
            const newEmail = professorData.email;
            console.log(currentEmail);

            if (!newEmail) {
                throw new Error("L'e-mail est requis.");
            }

            const updatedProfessor = { id, email: newEmail };

            await axios.put(`${process.env.REACT_APP_SPRING_BASE_URL}/api/professors/${id}/email`, updatedProfessor);

            setSnackbarSeverity('success');
            setSnackbarMessage('E-mail mis à jour avec succès.');
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'e-mail :", error);
            let errorMessage = "Erreur lors de la mise à jour de l'e-mail !";
            if (error.response && error.response.data) {
                errorMessage = error.response.data.message || errorMessage;
            }
            setSnackbarSeverity('error');
            setSnackbarMessage(errorMessage);
            setOpenSnackbar(true);
        }
    };

    const handlePasswordUpdate = async () => {
        try {
            const { id } = professorData;

            if (!newProfessorPassword) {
                throw new Error('Le mot de passe est requis.');
            }

            if (newProfessorPassword !== confirmPassword) {
                throw new Error('Les mots de passe ne correspondent pas.');
            }

            const updatedProfessor = { id, password: newProfessorPassword };

            await axios.put(`${process.env.REACT_APP_SPRING_BASE_URL}/api/professors/${id}/password`, updatedProfessor);

            setSnackbarSeverity('success');
            setSnackbarMessage('Mot de passe mis à jour avec succès.');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du mot de passe :', error);
            let errorMessage = 'Erreur lors de la mise à jour du mot de passe !';
            if (error.response && error.response.data) {
                errorMessage = error.response.data.message || errorMessage;
            }
            setSnackbarSeverity('error');
            setSnackbarMessage(errorMessage);
            setOpenSnackbar(true);
        } finally {
            setNewProfessorPassword('');
            setConfirmPassword('');
        }
    };

    const handleResetData = async () => {
        try {
            // Vérification du texte de confirmation
            if (confirmationText.trim().toLowerCase() !== 'je confirme la réinitialisation') {
                throw new Error('Le texte de confirmation est incorrect.');
            }
    
            // Vérification du mot de passe de réinitialisation
            if (!resetPassword) {
                throw new Error('Le mot de passe est requis.');
            }
    
            // Confirmation du mot de passe avec l'API
            const response = await axios.post(`${process.env.REACT_APP_SPRING_BASE_URL}/api/auth/confirm-password`, {
                email: professorData.email,
                password: resetPassword,
            });
    
            if (response.data === 'Password confirmed successfully.') {
                // Réinitialisation réussie, envoyer les requêtes DELETE
                const deleteSessionsResponse = await axios.delete(`${process.env.REACT_APP_SPRING_BASE_URL}/api/session/deleteAll`);
                const deleteStudentsResponse = await axios.delete(`${process.env.REACT_APP_SPRING_BASE_URL}/api/students/deleteAll`);
    
                // Vérifier les réponses des suppressions
                if (deleteSessionsResponse.status === 200 && deleteStudentsResponse.status === 200) {
                    setSnackbarSeverity('success');
                    setSnackbarMessage('Réinitialisation effectuée avec succès.');
                } else {
                    throw new Error('Erreur lors de la suppression des sessions ou des étudiants.');
                }
            } else {
                // Mot de passe incorrect
                setSnackbarSeverity('error');
                setSnackbarMessage('Mot de passe invalide.');
            }
        } catch (error) {
            console.error('Erreur lors de la réinitialisation :', error);
    
            let errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la réinitialisation !';
    
            if (typeof errorMessage !== 'string') {
                errorMessage = 'Une erreur inattendue est survenue.';
            }
    
            setSnackbarSeverity('error');
            setSnackbarMessage(errorMessage);
        } finally {
            setOpenSnackbar(true);
            setOpenDialog(false);
            setConfirmationText('');
            setResetPassword('');
        }
    };

    return (
        <Container>
            <Typography variant="h3" gutterBottom>Paramètres</Typography>

            <Box mb={4}>
                <Typography variant="h5">Changer l'email</Typography>
                <TextField
                    label="Nouvelle adresse e-mail"
                    type="email"
                    value={professorData.email}
                    onChange={(e) => setProfessorData({ ...professorData, email: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={handleEmailUpdate} sx={{ mt: 2 }}>
                    Confirmer le nouvel email
                </Button>
            </Box>

            <Box mb={4}>
                <Typography variant="h5">Changer le mot de passe</Typography>
                <TextField
                    label="Nouveau mot de passe"
                    type="password"
                    value={newProfessorPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Confirmer le mot de passe"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={handlePasswordUpdate} sx={{ mt: 2 }}>
                    Confirmer le nouveau mot de passe
                </Button>
            </Box>

            <Box mb={4}>
                <Typography variant="h5">Réinitialiser les données</Typography>
                <Typography variant="subtitle1" mb={2}>
                    Cette section vous permet de supprimer toutes les absences, emplois du temps ainsi que les étudiants.
                </Typography>
                <Button variant="contained" color="error" onClick={openResetDialog}>
                    Réinitialiser les données
                </Button>
            </Box>

            <Dialog open={openDialog} onClose={closeResetDialog}>
                <DialogTitle>Confirmation de réinitialisation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Veuillez confirmer en tapant "je confirme la réinitialisation" et en entrant votre mot de passe.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label='Tapez "je confirme la réinitialisation"'
                        type="text"
                        fullWidth
                        value={confirmationText}
                        onChange={handleConfirmationTextChange}
                    />
                    <TextField
                        margin="dense"
                        label="Mot de passe"
                        type="password"
                        fullWidth
                        value={resetPassword}
                        onChange={handleResetPasswordChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeResetDialog} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleResetData} color="error">
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbarSeverity}
                    onClose={handleSnackbarClose}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default SettingsPage;
