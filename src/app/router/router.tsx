import { createBrowserRouter, type RouteObject } from 'react-router'
import BaseLayout from '../layouts/BaseLayout/BaseLayout'
import AuthLayout from '../layouts/AuthLayout/AuthLayout'
import DashboardPage from '../../pages/DashboardPage/DashboardPage'
import LoginPage from '../../pages/LoginPage/LoginPage'
import SignupPage from '../../pages/SignupPage/SignupPage'
import { paths } from './paths'

export const appRoutes: RouteObject[] = [
  {
   Component: BaseLayout,
   children: [
     { path: paths.dashboard, Component: DashboardPage },
   ],
 },
  {
    Component: AuthLayout,
    children: [
      { path: paths.login, Component: LoginPage },
      { path: paths.signup, Component: SignupPage },
    ],
  },
]

export const router = createBrowserRouter(appRoutes)
