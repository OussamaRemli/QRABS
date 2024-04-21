import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRoutes  } from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider, Button } from '@mui/material';

// routing

import ThemeRoutes from 'routes'; // Importing ThemeRoutes from 'routes'
//import LoginRoute from 'login-routes'; // Importing LoginRoutes from 'routes'
//import AuthenticationRoutes from 'routes/AuthenticationRoutes'
//import Routes from 'routes'; // Importing UserRoutes from 'user-routes'
import Routes from 'user-routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import adminImage from './assets/images/Admin.png'; // Importez votre image d'administrateur
import professorImage from './assets/images/Professor.png'; // Importez votre image de professeur



const App = () => {
  const customization = useSelector((state) => state.customization);
  const [selectedRole, setSelectedRole] = useState(null);
  const handleAdminClick = () => {
    setSelectedRole('admin');
  };

  const handleProfessorClick = () => {
    setSelectedRole('professor');
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <ThemeRoutes/>
          {/* {selectedRole === 'admin' ? <ThemeRoutes /> : null}
          {selectedRole === 'professor' ? <Routes /> : null}
          <div style={{ display: 'flex', justifyContent:'space-evenly',alignItems:'center',width:'100vw',height:'100vh' }}>
            <div style={{display:'flex',flexDirection:'column'}}>
              <img src={adminImage} alt="Admin" style={{ width: '200px', height: '200px' }} />
              <Button onClick={handleAdminClick} color="secondary" variant="contained" sx={{borderRadius: '8px', textTransform: 'none' }}>Admin</Button>
            </div>
            <div style={{display:'flex',flexDirection:'column'}}>
              <img src={professorImage} alt="Professor" style={{ width: '200px', height: '200px' }} />
              <Button onClick={handleProfessorClick} color="secondary" variant="contained" sx={{borderRadius: '8px', textTransform: 'none' }}>Professor</Button>
            </div>
          </div> */}
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
