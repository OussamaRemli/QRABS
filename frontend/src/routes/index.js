import { useRoutes } from 'react-router-dom';

import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import ForgotPassword from 'views/pages/authentication/authentication3/ForgotPassword';
import VerifyCode from 'views/pages/authentication/authentication3/VerifyCode';

export default function ThemeRoutes() {
  return useRoutes([AuthenticationRoutes,MainRoutes,{
    path: '/forgot-password',
    element: <ForgotPassword/>

  },{
    path: '/Verify-Code',
    element: <VerifyCode/>

  },]);
}
