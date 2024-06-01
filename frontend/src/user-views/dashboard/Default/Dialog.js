import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const CustomDialog = ({ title, subtitle, onConfirm, onCancel, open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ fontSize: '1rem', color: 'text.secondary' }}>
                    {subtitle}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ padding: '8px 24px' }}>
                <Button onClick={onConfirm} color="primary" variant="outlined" sx={{ marginRight: '16px', borderRadius: '8px', textTransform: 'none' }}>
                    Confirmer
                </Button>
                <Button onClick={onCancel} color="primary" variant="contained" autoFocus sx={{ borderRadius: '8px', textTransform: 'none' }}>
                    Annuler
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomDialog;
