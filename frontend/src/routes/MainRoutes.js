import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// Dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Departement = Loadable(lazy(() => import('views/departments')));
const Filiere = Loadable(lazy(() => import('views/filieres')));
const Update = Loadable(lazy(() => import('layout/MainLayout/Header/ProfileSection/Update')));

// Fetch data from the API
async function fetchLevels() {
  const response = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/levels`);
  const data = await response.json();
  return data;
}

const data = await fetchLevels();

// Generate dynamic routes for filieres
const filiereRoutes = data.reduce((acc, item) => {
  const sectorPath = `/filieres/${item.sectorName.toLowerCase()}`;
  const filiereRoute = {
    path: sectorPath,
    children: [
      {
        path: item.levelName.toLowerCase(),
        element: <Filiere abr={item.levelName} />
      }
    ]
  };

  // Check if sector route already exists
  const existingSectorRoute = acc.find(route => route.path === sectorPath);
  if (existingSectorRoute) {
    existingSectorRoute.children.push(filiereRoute.children[0]);
  } else {
    acc.push(filiereRoute);
  }

  return acc;
}, []);

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
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
      path: 'departements',
      children: [
        {
          path: 'MMA',
          element: <Departement abr='MMA' name='Département de Mécanique et Mathématiques appliquées' />
        },
        {
          path: 'EIT',
          element: <Departement abr='EIT' name="Département d'Electronique Informatique et Télécommunications" />
        },
        {
          path: 'LC',
          element: <Departement abr='LC' name="Département des Humanités et Management" />
        }
      ]
    },
    ...filiereRoutes,
    {
      path: 'update',
      element: <Update />
    }
  ]
};

export default MainRoutes;
