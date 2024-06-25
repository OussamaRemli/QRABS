import React, { useEffect, useState } from 'react';
import { Container, Typography, Select, MenuItem, TextField, Button, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EarningCard from 'ui-component/cards/Skeleton/EarningCard';

const SettingsPage = () => {
    const [selectedSession, setSelectedSession] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [professorId, setProfessorId] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [newProfessorFirstName, setNewProfessorFirstName] = useState('');
    const [newProfessorLastName, setNewProfessorLastName] = useState('');
    const [newProfessorEmail, setNewProfessorEmail] = useState('');
    const [newProfessorPassword, setNewProfessorPassword] = useState('');
    const [professorDepartmentId, setProfessorDepartmentId] = useState('');
    const [professorSessions , setProfessorSessions] = useState([]);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const tokenParts = token.split('.');
                    const tokenPayload = JSON.parse(atob(tokenParts[1]));
                    setProfessorId(parseInt(tokenPayload.id, 10));
                    setProfessorDepartmentId(parseInt(tokenPayload.departmentId, 10));
                    setNewProfessorFirstName(tokenPayload.firstName);
                    setNewProfessorLastName(tokenPayload.lastName);
                    setNewProfessorEmail(tokenPayload.sub);

                    // Fetch professor's sessions
                    const response = await axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/session/sessions/${parseInt(tokenPayload.id, 10)}`);
                    setProfessorSessions(response.data);
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
            if (!newProfessorEmail || !newProfessorPassword) {
                throw new Error('Toutes les données requises ne sont pas fournies.');
            }

            const professorData = {
                professorId: professorId,
                email: newProfessorEmail,
                password: newProfessorPassword,
                firstName: newProfessorFirstName,
                lastName: newProfessorLastName,
                department: {
                    departmentId: professorDepartmentId
                }
            };
            await axios.put(`${process.env.REACT_APP_SPRING_BASE_URL}/api/professors`, professorData);
            setSnackbarSeverity('success');
            setSnackbarMessage('Mise à jour réussie');
            setOpenSnackbar(true);
            setNewProfessorPassword('');
            setConfirmPassword('');

            setTimeout(() => {
                navigate('/dashboard/default');
            }, 1000)
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données:', error);
            let errorMessage = 'Erreur lors de la mise à jour des données!';
            if (error.response && error.response.data) {
                errorMessage = error.response.data.message || errorMessage;
            }
            setSnackbarSeverity('error');
            setSnackbarMessage(errorMessage);
            setOpenSnackbar(true);
        }
    };
// Front-end code for updating e-mail
    const handleEmailUpdate = async () => {
        try {
            if (!newProfessorEmail) {
                throw new Error("L'e-mail est requis.");
            }
            const professorData ={
               email : newProfessorEmail
            }
            await axios.put(`${process.env.REACT_APP_SPRING_BASE_URL}/api/professors/${professorId}/email`, professorData);

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

// Front-end code for updating password

    const handlePasswordUpdate = async () => {
        if (newProfessorPassword !== confirmPassword) {
            setSnackbarSeverity('error');
            setSnackbarMessage('Les mots de passe ne correspondent pas.');
            setOpenSnackbar(true);
        }else{
        try {
            if (!newProfessorPassword) {
                throw new Error('Le mot de passe est requis.');
            }

            const professorData = {
                professorId: professorId,
                password: newProfessorPassword
            };

            await axios.put(`${process.env.REACT_APP_SPRING_BASE_URL}/api/professors/${professorId}/password`, professorData);

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
        }}
    };

    const handleSessionChange = (event) => {
        setSelectedSession(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setNewProfessorPassword(event.target.value);
    };

    const handleEmailChange = (event) => {
        setNewProfessorEmail(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };


    const handleConfirmAbsence = () => {
        // Find the selected session data based on the selected value
        const sessionData = professorSessions.find(
            (session, index) => `session${index + 1}` === selectedSession
        );

        if (sessionData) {
            navigate('/reportedSession', { state: { Session: sessionData } });
        } else {
            alert('Please select a session first.');
        }
    };


    return (
        <Container>
            <Typography variant="h4" gutterBottom>Paramètres</Typography>

            <Box mb={2}>
                <Typography variant="h6">Marquer l'absence</Typography>
                <Typography variant="subtitle1">En cas de report d'une séance, vous êtes invité(e) à indiquer votre absence pour cette séance.</Typography>
                <Select value={selectedSession} onChange={handleSessionChange} fullWidth margin="normal">
                    <MenuItem value="">
                        <em>Choisir une séance</em>
                    </MenuItem>
                    {professorSessions.map((session, index) => (
                        <MenuItem key={session.sessionId} value={`session${index + 1}`}>
                            {`${session.level.levelName} - ${session.byGroup ? session.groupName + ' - ' : ''}${session.module.moduleName} - ${session.sessionType}`}
                        </MenuItem>
                    ))}

                </Select>
            </Box>
            <Box mb={3}>
                <Button variant="contained" color="primary"   onClick={handleConfirmAbsence}>
                    Confirmer l'absence
                </Button>
            </Box>

            <Box mb={2}>
                <Typography variant="h6">Changer l'email</Typography>
                <TextField
                    label="Nouvelle adresse e-mail"
                    type="email"
                    value={newProfessorEmail}
                    onChange={handleEmailChange}
                    fullWidth margin="normal"
                />
            </Box>
            <Box mb={3}>
                <Button variant="contained" color="primary" onClick={handleEmailUpdate}>
                    Confirmer le nouvel email
                </Button>
            </Box>

            <Box mb={2}>
                <Typography variant="h6">Changer le mot de passe</Typography>
                <TextField
                    label="Nouveau mot de passe"
                    type="password"
                    value={newProfessorPassword}
                    onChange={handlePasswordChange}
                    fullWidth margin="normal"
                />
                <TextField
                    label="Confirmer le mot de passe"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    fullWidth margin="normal"
                />
            </Box>
            <Box mb={3}>
                <Button variant="contained" color="primary" onClick={handlePasswordUpdate}>
                    Confirmer le nouveau mot de passe
                </Button>
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
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default SettingsPage;
