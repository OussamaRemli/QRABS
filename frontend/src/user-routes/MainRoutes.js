// import { lazy } from 'react';
//
// // project imports
// import MainLayout from 'user-layout/MainLayout';
// import Loadable from 'ui-component/Loadable';
// import SettingsPage from "../user-layout/MainLayout/Header/ProfileSection/Setting";
// // utilities routing
// // const UtilsTypography = Loadable(lazy(() => import('user-views/utilities/Typography')));
// // const UtilsColor = Loadable(lazy(() => import('user-views/utilities/Color')));
// // const UtilsShadow = Loadable(lazy(() => import('user-views/utilities/Shadow')));
// // const UtilsMaterialIcons = Loadable(lazy(() => import('user-views/utilities/MaterialIcons')));
// // const UtilsTablerIcons = Loadable(lazy(() => import('user-views/utilities/TablerIcons')));
//
//
// // dashboard routing
// const DashboardDefault = Loadable(lazy(() => import('user-views/dashboard/Default')));
// const ReportedSession = Loadable(lazy(() => import('user-views/dashboard/Default/ReportedSession')));
//
// const Update = Loadable(lazy(() => import('user-layout/MainLayout/Header/ProfileSection/Update')));
//
//
// // sample page routing
// const SamplePage = Loadable(lazy(() => import('user-views/sample-page')));
//
// // Fetch data from the API
// const response = await fetch('`${process.env.REACT_APP_SPRING_BASE_URL}/api/modules/professor/75');
// const data = await response.json();
//
// // ==============================|| MAIN ROUTING ||============================== //
//
// const MainRoutes = {
//   path: '/',
//   element: <MainLayout />,
//   children: [
//     {
//       path: '/',  // this path is now working
//       element: <DashboardDefault />
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'default', // this is working
//           element: <DashboardDefault />
//         }
//       ]
//     },
//     {
//       path: 'setting',
//       element: <SettingsPage/>
//     },
//     {
//       path: 'reportedsession',
//       element: <ReportedSession/>
//     },
//     ...data.map(item => ({
//       path: item.moduleName,
//       children: [
//         {
//           path: item.level.levelId.toString(), // this is working
//           element: <SamplePage moduleId={item.moduleId} levelId={item.level.levelId} />
//         }
//       ]
//     }))
//   ]
// };
//
// export default MainRoutes;
