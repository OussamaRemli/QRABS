import { useRoutes } from 'react-router-dom';
import { lazy, useEffect, useState } from "react";
import Loadable from "../ui-component/Loadable";
import MainLayout from "../user-layout/MainLayout";


// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('user-views/dashboard/Default')));
const Update = Loadable(lazy(() => import('user-layout/MainLayout/Header/ProfileSection/Update')));


// sample page routing
const SamplePage = Loadable(lazy(() => import('user-views/sample-page')));
import AuthenticationRoutes from './AuthenticationRoutes';

// ==============================|| ROUTING RENDER ||============================== //

function UserRoutes() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      const DashboardDefault = Loadable(lazy(() => import('user-views/dashboard/Default')));
      const SamplePage = Loadable(lazy(() => import('user-views/sample-page')));

      // Fetch data from the API
      const response = await fetch('http://localhost:8080/api/modules/professor/1');
      const data = await response.json();

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
            path: 'update',
            element: <Update/>
          },
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
  }, []);

  return useRoutes([AuthenticationRoutes, ...routes]); // Ajouter AuthenticationRoutes avant les routes spécifiques au professeur
}

export default UserRoutes;
