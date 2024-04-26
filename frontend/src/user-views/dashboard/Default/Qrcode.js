import {useState} from 'react';
// material-ui
import {Button, CardContent, Grid, Typography} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import {CardActions} from "@mui/material";
import {gridSpacing} from 'store/constant';

// assets
import FullscreenSharpIcon from '@mui/icons-material/FullscreenSharp';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
import QRCode from "react-qr-code";
import AlertProvider from "./AlertContext";
import ResponsiveDialog from "./ResponsiveDialog";
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const Qrcode = ({url,levelId,sessionId}) => {

    const [isExpanded, setQrIsExpanded] = useState(false);
    const [isDone, setIsDone] = useState([]);

    const handleConfirm = (levelId) => {
        setIsDone([...isDone, levelId]);
    }

    const expandQrSize = () => {
        setQrIsExpanded(true);
    }

    const reduceQrSize = () => {
        setQrIsExpanded(false);
    }

    return (
        <>
            <Grid>
                {!isDone.includes(levelId) && (
                    <AlertProvider>
                        <ResponsiveDialog
                            dialogContent={"Êtes-vous sûr de marquer l'absence"}
                            button={'Marquer absence'}
                            levelid={levelId}
                            sessionid={sessionId}
                            onClick={handleConfirm}
                        />
                    </AlertProvider>
                )}
            </Grid>
            <br />
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
                    {isExpanded && (
                        <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                            <Typography sx={{ mt: 2, fontSize: 20 }}>Scannez ce code</Typography>
                        </CardActions>
                    )}
                    {!isDone.includes(levelId) ? (
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={30}>
                                <Grid container alignContent="center" justifyContent="center">
                                    <QRCode
                                        value={url}
                                        style={{
                                            width: isExpanded ? '35%' : '80%',
                                            height: isExpanded ? '35%' : '80%',
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    ) : (
                        <TaskAltIcon color="success" sx={{ fontSize: 200 }} />
                    )}
                    <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                        {!isDone.includes(levelId) && (
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
                        )}
                    </CardActions>
                </CardContent>
            </MainCard>
        </>
    );

}

export default Qrcode;
