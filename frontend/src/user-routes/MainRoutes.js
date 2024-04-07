import { lazy } from 'react';

// project imports
import MainLayout from 'user-layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('user-views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('user-views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('user-views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('user-views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('user-views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('user-views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('user-views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',  // in this path is not working
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default', // in this working
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <UtilsTablerIcons />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'material-icons',
          element: <UtilsMaterialIcons />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
