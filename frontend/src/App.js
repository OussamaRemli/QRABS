import React, { useState,useEffect  } from 'react';
import { useSelector } from 'react-redux';
import './App.css'

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider, Button } from '@mui/material';
import Typewriter from 'typewriter-effect';

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
const parseToken = (token) => {
  if (!token) return null; // Vérifier si le token est présent
  
  const tokenParts = token.split('.'); // Diviser le token en parties
  const tokenPayload = tokenParts[1];
  
  try {
    const decodedPayload = JSON.parse(atob(tokenPayload));
    return decodedPayload.role;
  } catch (error) {
    console.error("Error parsing token payload:", error);
    return null;
  }
};


const App = () => {
  const customization = useSelector((state) => state.customization);
  const [selectedRole, setSelectedRole] = useState(null);
  const handleAdminClick = () => {
    setSelectedRole('admin');
  };
  
  const handleProfessorClick = () => {
    setSelectedRole('professor');
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const role = parseToken(token);
      if (role === 'ROLE_ADMIN') {
        setSelectedRole('admin');
      } else if (role === 'ROLE_PROFESSOR') {
        setSelectedRole('professor');
      } else {
        console.error('Unknown or undefined role:', role);
      }
    }
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);

  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          {selectedRole === 'admin' ? <ThemeRoutes /> : null}
          {selectedRole === 'professor' ? <Routes /> : null}
          {selectedRole === null && ( // Afficher les images et les boutons uniquement si aucun rôle n'est sélectionné
            <div style={{display:'flex',justifyContent:'center', flexDirection:'column', width:'100vw', height: '100vh'}}>
              <Typewriter
                options={{
                  strings: ['<h1 style="text-align: center; margin-bottom: 50px;">Bienvenue au <span style="color: #3f51b5;">QRABS</span>! Vous êtes:</h1>'],
                  autoStart: true,
                  loop: true,
                  delay: 100,
                }}
              style={{ display: 'block' }} // Assurez-vous que le contenu est affiché en tant que bloc
            />
              <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexDirection:'row', flexWrap:'wrap', gap:'12px'}}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <img src={adminImage} alt="Admin" style={{ width: '200px', height: '200px' }} />
                  <Button onClick={handleAdminClick} color="secondary" variant="contained" sx={{ borderRadius: '8px', textTransform: 'none' }}>Admin</Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <img src={professorImage} alt="Professor" style={{ width: '200px', height: '200px' }} />
                  <Button onClick={handleProfessorClick} color="secondary" variant="contained" sx={{ borderRadius: '8px', textTransform: 'none' }}>Professor</Button>
                </div>
              </div>
            </div>
          )}
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
