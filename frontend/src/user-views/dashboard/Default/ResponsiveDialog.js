import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningIcon from '@mui/icons-material/Warning';
import { useAlert } from './AlertContext';


export default function ResponsiveDialog({button,dialogContent,levelid,sessionid,onClick}) {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const { showAlert } = useAlert();

    const onConfirm = () => {
        if (sessionid && levelid) {
            fetch(`http://localhost:8080/api/absence/${sessionid}/${levelid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('La requête a échoué');
                    }
                    onClick(levelid);
                    showAlert('Ceci est une alerte de succès — regardez!', 'success');
                })
                .catch(error => {
                    console.error('Erreur lors de l\'envoi de la requête:', error);
                    showAlert('Ceci est une alerte d\'erreur — attention!', 'error');
                });
        } else {
            showAlert('Veuillez fournir un identifiant de session et de niveau valide.', 'error');
        }
    };



    return (
        <React.Fragment>
            <Button variant="contained" endIcon={<CheckCircleOutlineIcon  />} onClick={handleClickOpen}>
                {button}
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    <WarningIcon/> {"Attetion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Annuler
                    </Button>
                    <Button onClick={() => { onConfirm(); handleClose(); }} autoFocus>
                        Continuer
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}