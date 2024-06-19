import {useState,useEffect} from 'react';

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {
    Button,
    ButtonGroup,
    CardContent,
    Grid, Snackbar,
    Typography
} from '@mui/material';
import Alert from '@mui/material/Alert';

import MainCard from 'ui-component/cards/MainCard';
import {CardActions} from "@mui/material";
import {gridSpacing} from 'store/constant';

import FullscreenSharpIcon from '@mui/icons-material/FullscreenSharp';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
import QRCode from "react-qr-code";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import axios from "axios";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CustomDialog from "./Dialog";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import * as React from "react";
import Face from '../../../assets/images/1.svg';
const Qrcode = ({levelId,sessionId,group}) => {



    useEffect(() => {
        let stompClient = null;
        let codeSubscription = null;
    
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/absence/code?levelId=${levelId}`);
                setCode(response.data);
                
                // Assuming you want to do something with the response here
                console.log('Data fetched:', response.data);
            } catch (error) {
                console.error('Fetch Data Error:', error);
            }
        };
    
        const connectWebSocket = () => {
            const socket = new SockJS(`${process.env.REACT_APP_BASE_URL}/ws`);
            stompClient = Stomp.over(socket);
    
            stompClient.connect({}, () => {
                codeSubscription = stompClient.subscribe(`/topic/code/${levelId}`, (message) => {
                    setCode(message.body);
                    // Force a re-render if necessary
                    forceUpdate();
                });
            });
        };
    
        fetchData().then(connectWebSocket); // Ensure WebSocket connects after fetching data
    
        return () => {
            if (codeSubscription) {
                codeSubscription.unsubscribe();
            }
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [levelId]); // Add levelId as a dependency to re-run effect if it changes
    

     
    const [code,setCode]=useState('');
    const [isExpanded, setQrIsExpanded] = useState(false);
    const [isDone, setIsDone] = useState([]);
    const [openCameraDialog, setOpenCameraDialog] = useState(false);
    const [openMarkAbsenceDialog, setOpenMarkAbsenceDialog] = useState(false);
    const [openQrcodeDialog, setOpenQrCodeDialog] = useState(false);
    const [facialRecognition,setFacialRecognition]=useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarOpen = (message) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    };
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };


    const handleCameraClick = () => {
        setOpenCameraDialog(true);


    };
    const handleCameraCancel = () => {
        setOpenCameraDialog(false);
    };
    const handleMarkAbsenceClick = () => {
        setOpenMarkAbsenceDialog(true);
    };
    const handleMarkAbsenceCameraCancel = () => {
        setOpenMarkAbsenceDialog(false);
    };
    const handleQrcodeClick = () => {
        setOpenQrCodeDialog(true);
    };
    const handleQrcodeCancel = () => {
        setOpenQrCodeDialog(false);
    };

    const handleConfirm = (levelId,sessionId,group) => {

        fetch(`${process.env.REACT_APP_BASE_URL}/api/absence/${sessionId}/${levelId}/${group}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('La requête a échoué');
                    setSnackbarSeverity('error');
                    setSnackbarMessage('une erreur s est produite absence échoué');
                    setOpenSnackbar(true);

                }
                setSnackbarSeverity('success');
                setSnackbarMessage("l'absence est bien enregistré");
                setOpenSnackbar(true);
                setIsDone([...isDone, levelId]);
                localStorage.setItem('countQrabs', JSON.stringify(0));
                localStorage.setItem('presentQrabs', JSON.stringify(''));



            })
            .catch(error => {
       });
    }

    const expandQrSize = () => {
        setQrIsExpanded(true);
    }

    const reduceQrSize = () => {
        setQrIsExpanded(false);
    }

    const sendToPython = () => {
        const pythonServerEndpoint = 'http://192.168.1.109:5005/prestart-recognition';
        const data = {
            sessionId: sessionId,
            levelId: levelId,
            group: group
        };

        axios.post(pythonServerEndpoint)
            .then(()=> {
                axios.post('http://192.168.1.109:5005/start-recognition',data)// Exécutez ces actions juste après l'envoi de la requête
                    .then(()=>{});
                setFacialRecognition(true);
           
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi des données à Python:', error);
                setSnackbarSeverity('error');
                setSnackbarMessage('Une erreur est survenue lors de la connexion au serveur');
                setOpenSnackbar(true);
            });

    };
    function stopFacialRecognition() {
        axios.post('http://192.168.1.109:5005/stop-recognition')
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error("Erreur lors de l'arrêt de la reconnaissance faciale :", error);
            });
    }




    return (
        <>
            <Grid>
                {!isDone.includes(levelId) && (
                    <Button variant="contained" endIcon={<CheckCircleOutlineIcon  />} onClick={()=>{ handleMarkAbsenceClick();}}>
                        marquer l'absence
                    </Button> )}
            </Grid>
            <br />
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
            <MainCard
                content={false}
                style={{
                    zIndex: isExpanded ? '9999' : 'auto',
                    width: isExpanded ? '100vw' : 'auto',
                    height: isExpanded ? '100vh' : 'auto',
                    position: isExpanded ? 'fixed' : 'static',
                    top: isExpanded ? '50%' : 'auto',
                    left: isExpanded ? '50%' : 'auto',
                    transform: isExpanded ? 'translate(-50%, -50%)' : 'none',
                }}
            >
                <CardContent>
                    {(!isExpanded && !isDone.includes(levelId) ) && (
                    <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                    <ButtonGroup variant="text" aria-label="Basic button group">
                        <Button onClick={handleQrcodeClick}>
                            <QrCode2Icon/>
                        </Button>
                        <Button onClick={handleCameraClick}>
                            <CameraAltIcon />
                        </Button>
                    </ButtonGroup>
                    </CardActions>)}

                    {isExpanded && (
                        <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                            <Typography sx={{ mt: 2, fontSize: 20 }}>Scannez ce code</Typography>
                        </CardActions>
                    )}
                    {!isDone.includes(levelId) ? (
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container alignItems="center" justifyContent="center">
                                    {!facialRecognition ? (
                                        <QRCode
                                            value={`${process.env.REACT_APP_BASE_URL}/Qr/scan/${sessionId}/${levelId}/${group}/${code}`}
                                            style={{
                                                width: isExpanded ? '35%' : '80%',
                                                height: isExpanded ? '35%' : '80%',
                                            }}
                                        />
                                    ) : (
                                        <img src={Face}  />
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>

                    ) : (
                        <>
                        <h1>Absence éffectué</h1>
                        <TaskAltIcon color="success" sx={{ fontSize: 200 }} />
                        </>
                    )}
                    <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                        {!isDone || !isDone.includes(levelId) ? (
                            !facialRecognition ? (
                                <>
                                    {isExpanded ? (
                                        <Button size="small" disableElevation onClick={reduceQrSize}>
                                            Fermer
                                            <CloseFullscreenOutlinedIcon />
                                        </Button>
                                    ) : (
                                        <Button size="small" disableElevation onClick={expandQrSize}>
                                            Plein écran
                                            <FullscreenSharpIcon />
                                        </Button>
                                    )}
                                </>
                            ) : null
                        ) : null}
                    </CardActions>
                </CardContent>
            </MainCard>
            {openCameraDialog && <CustomDialog title={"Détection Faciale"} subtitle={"Veuillez utiliser la détection faciale pour procéder à l'enregistrement"} open={openCameraDialog} onClose={handleCameraCancel} onCancel={handleCameraCancel} onConfirm={()=>{sendToPython();
                handleCameraCancel();}}/> }
            {openMarkAbsenceDialog && <CustomDialog title={"Confirmation de l'absence "} subtitle={"Êtes-vous sûr de vouloir marquer cette absence ?"} open={openMarkAbsenceDialog} onClose={handleMarkAbsenceCameraCancel} onCancel={handleMarkAbsenceCameraCancel} onConfirm={() => {if(facialRecognition){stopFacialRecognition();} handleConfirm(levelId, sessionId, group);handleMarkAbsenceCameraCancel();}} />}
            {openQrcodeDialog && <CustomDialog title={"Annulalation de Détection Faciale"} subtitle={"Êtes-vous sûr de vouloir annuler la detection faciale ?"} open={openQrcodeDialog} onClose={handleQrcodeCancel} onCancel={handleQrcodeCancel} onConfirm={() => {stopFacialRecognition(); setFacialRecognition(false); handleQrcodeCancel();}} />}

        </>
    );

}

export default Qrcode;
