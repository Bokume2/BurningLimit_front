import { createBrowserRouter, type RouteObject } from 'react-router'
import BaseLayout from '../layouts/BaseLayout/BaseLayout'
import AuthLayout from '../layouts/AuthLayout/AuthLayout'
import DashboardPage from '../../pages/DashboardPage/DashboardPage'
import CalendarPage from '../../pages/CalendarPage/CalendarPage'
import GroupPage from '../../pages/GroupPage/GroupPage'
import LoginPage from '../../pages/LoginPage/LoginPage'
import SignupPage from '../../pages/SignupPage/SignupPage'
import { paths } from './paths'

export const appRoutes: RouteObject[] = [
  {
   Component: BaseLayout,
   children: [
     { path: paths.dashboard, Component: DashboardPage },
     { path: paths.calendar, Component: CalendarPage },
     { path: paths.group, Component: GroupPage },
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
