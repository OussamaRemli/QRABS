import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';

const AuthLogin3 = Loadable(lazy(() => import('user-views/pages/authentication/authentication3/Login3')));

const AuthenticationRoutes = {
  path: '/',
  element: <AuthLogin3 />,
};

export default AuthenticationRoutes;
