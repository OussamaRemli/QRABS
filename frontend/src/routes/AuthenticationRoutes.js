import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));


const AuthenticationRoutes = {
  path: '/',
  element: <AuthLogin3 />,
  // children: [
  //   {
  //     path: '/pages/login/login3',
  //     element: <AuthLogin3 />
  //   },
  //   {
  //     path: '/pages/register/register3',
  //     element: <AuthRegister3 />
  //   }
  // ]
};

export default AuthenticationRoutes;
