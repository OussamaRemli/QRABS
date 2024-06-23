import { useRoutes } from 'react-router-dom';
import { lazy, useEffect, useState } from "react";
import Loadable from "../ui-component/Loadable";
import MainLayout from "../user-layout/MainLayout";

// Importation des composants pour le routage
// const DashboardDefault = Loadable(lazy(() => import('user-views/dashboard/Default')));
// const Update = Loadable(lazy(() => import('user-layout/MainLayout/Header/ProfileSection/Update')));
// const SamplePage = Loadable(lazy(() => import('user-views/sample-page')));
import AuthenticationRoutes from './AuthenticationRoutes';
import SettingsPage from "../user-layout/MainLayout/Header/ProfileSection/Setting";
import ReportedSession from "../user-views/dashboard/Default/ReportedSession";
import ForgotPassword from "../user-views/pages/authentication/authentication3/ForgotPassword";
import VerifyCode from "../user-views/pages/authentication/authentication3/VerifyCode";



function UserRoutes() {
  // États pour gérer les routes et l'ID du professeur
  const [routes, setRoutes] = useState([]);
  const [professorId, setProfessorId] = useState(null);

  // Effet pour récupérer le token de l'utilisateur et extraire l'ID du professeur
  useEffect(() => {
    const intervalId = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const tokenParts = token.split('.');
        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        setProfessorId(parseInt(tokenPayload.id, 10));
        clearInterval(intervalId);
      }
    }, 1000); // Vérifiez toutes les secondes

    return () => clearInterval(intervalId);
  }, []);

  // Effet pour récupérer les routes dynamiques en fonction de l'ID du professeur
  useEffect(() => {
    if (professorId) {
      const fetchRoutes = async () => {
        const DashboardDefault = Loadable(lazy(() => import('user-views/dashboard/Default')));
        const SamplePage = Loadable(lazy(() => import('user-views/sample-page')));

        // Appel à l'API pour récupérer les modules du professeur
        const response = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/session/professor/${professorId}/modules`);
        const data = await response.json();

        // Définition des routes principales
        const mainRoutes = {
          path: '/',
          element: <MainLayout />,
          children: [
            {
              path: '/',
              element: <DashboardDefault />
            },
            {
              path: 'dashboard',
              children: [
                {
                  path: 'default',
                  element: <DashboardDefault />
                }
              ]
            },
            {
              path: 'setting',
              element: <SettingsPage />
            },
            {
              path: 'reportedsession',
              element: <ReportedSession />
            },
            // Ajout des routes dynamiques basées sur les modules du professeur
            ...data.map(item => ({
              path: item.moduleName,
              children: [
                {
                  path: item.level.levelId.toString(),
                  element: <SamplePage moduleId={item.moduleId} levelId={item.level.levelId} />
                }
              ]
            }))
          ]
        };

        setRoutes([mainRoutes]);
      };

      fetchRoutes();
    }
  }, [professorId]);

  return useRoutes([AuthenticationRoutes, ...routes, {
    path: '/forgot-password',
    element: <ForgotPassword/>

  },{
    path: '/Verify-Code',
    element: <VerifyCode/>

  },
 ]);
}

export default UserRoutes;
