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


const Qrcode = () => {

    const [isExpanded, setQrIsExpanded] = useState(false);
    const expandQrSize = () => {
        setQrIsExpanded(true);
    }

    const reduceQrSize = () => {
        setQrIsExpanded(false);
    }

    return (
        <>
            <MainCard content={false}
                      style={{
                          zIndex: isExpanded ? '1' : 'auto',
                          width: isExpanded ? '100vw' : 'auto',
                          height: isExpanded ? '100vh' : 'auto',
                          position: isExpanded ? 'fixed' : 'static',
                          top: isExpanded ? '50%' : 'auto',
                          left: isExpanded ? '50%' : 'auto',
                          transform: isExpanded ? 'translate(-50%, -50%)' : 'none',
                      }}>
                <CardContent>
                    {isExpanded && <CardActions sx={{p: 1.25, pt: 0, justifyContent: 'center'}}>
                        <Typography
                            sx={{
                                mt: 2,
                                fontSize: 20,
                            }}
                        >
                            Scannez ce code
                        </Typography>
                    </CardActions>}
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={30}>
                            <Grid container alignContent="center" justifyContent="center">
                                <QRCode
                                    value="Subscribe"
                                    style={{
                                        width: isExpanded ? '35%' : '80%',
                                        height: isExpanded ? '35%' : '80%',
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions sx={{p: 1.25, pt: 0, justifyContent: 'center'}}>
                    {
                        isExpanded ?
                            (<Button size="small" disableElevation onClick={reduceQrSize}>
                                close
                                <CloseFullscreenOutlinedIcon/>
                            </Button>) :
                            (<Button size="small" disableElevation onClick={expandQrSize}>
                                Full screen
                                <FullscreenSharpIcon/>
                            </Button>)
                    }
                </CardActions>
            </MainCard>
        </>
    );
};


export default Qrcode;
