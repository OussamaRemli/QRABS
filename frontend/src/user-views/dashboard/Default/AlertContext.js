import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import {Alert, AlertTitle} from "@mui/lab";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({ open: false, message: '', severity: '' });

    const showAlert = (message, severity) => {
        setAlert({ open: true, message, severity });
    };

    const closeAlert = () => {
        setAlert({ ...alert, open: false });
    };

    return (
        <AlertContext.Provider value={{ showAlert, closeAlert }}>
            {children}
            <Snackbar
                open={alert.open}
                autoHideDuration={5000}
                onClose={closeAlert}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Alert severity={alert.severity}>
                    <AlertTitle>{alert.severity}</AlertTitle>
                    {alert.message}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
};

export default AlertProvider;