import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
// const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
// const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
// const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));
const Departement = Loadable(lazy(() => import('views/departments')));
const Filiere = Loadable(lazy(() => import('views/filieres')));
const Update = Loadable(lazy(() => import('layout/MainLayout/Header/ProfileSection/Update')));

// sample page routing
// const SamplePage = Loadable(lazy(() => import('views/sample-page')));

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
          // element: <UtilsTypography />
          element: <Departement abr='MMA' name='Département de Mécanique et Mathématiques appliquées'/>
        }
      ]
    },
    {
      path: 'departements',
      children: [
        {
          path: 'EIT',
          // element: <UtilsTypography />
          element: <Departement abr='EIT' name="Département d'Electronique Informatique & Télécommunications"/>
        }
      ]
    },
    {
      path: 'departements',
      children: [
        {
          path: 'LC',
          // element: <UtilsTypography />
          element: <Departement abr='LC' name="Département des Humanités & Management"/>
        }
      ]
    },
    {
      path: '/filieres/gi',
      children: [
        {
          path: 'gi3',
          // element: <UtilsTypography />
          element: <Filiere name='Génie Informatique' abr='GI3'/>
        },
        {
          path: 'gi4',
          // element: <UtilsTypography />
          element: <Filiere name='Génie Informatique' abr='GI4'/>
        },
        {
          path: 'gi5',
          // element: <UtilsTypography />
          element: <Filiere name='Génie Informatique' abr='GI5'/>
        },
      ]
    },
    {
      path: '/filieres/gc',
      children: [
        {
          path: 'gc3',
          // element: <UtilsTypography />
          element: <Filiere name='Génie Civil' abr='GC3'/>
        },
        {
          path: 'gc4',
          // element: <UtilsTypography />
          element: <Filiere name='Génie Civil' abr='GC4'/>
        },
        {
          path: 'gc5',
          // element: <UtilsTypography />
          element: <Filiere name='Génie Civil' abr='GC5'/>
        },
      ]
    },
    {
      path: '/filieres/gseir',
      children: [
        {
          path: 'gseir3',
          // element: <UtilsTypography />
          element: <Filiere name='Génie Des Systemes Elec...' abr='GSEIR3'/>
        },
        {
          path: 'gseir4',
          // element: <UtilsTypography />
          element: <Filiere name='Génie Des Systemes Elec...' abr='GSEIR4'/>
        },
        {
          path: 'gseir5',
          // element: <UtilsTypography />
          element: <Filiere name='Génie Des Systemes Elec...' abr='GSEIR5'/>
        },
      ]
    },
    {
      path: '/filieres/dscc',
      children: [
        {
          path: 'dscc3',
          // element: <UtilsTypography />
          element: <Filiere name='Data Science & Cloud...' abr='DSCC3'/>
        },
        {
          path: 'dscc4',
          // element: <UtilsTypography />
          element: <Filiere name='Data Science & Cloud...' abr='DSCC4'/>
        },
        {
          path: 'dscc5',
          // element: <UtilsTypography />
          element: <Filiere name='Data Science & Cloud...' abr='DSCC5'/>
        },
      ]
    },
    {
      path: 'update',
      element: <Update/>
    }
  ]
};

export default MainRoutes;
