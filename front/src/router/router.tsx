import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import RootLayout from "../layouts/RootLayout";

import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ProjectDetailComponent from "../pages/Project/ProjectDetailComponent";
import ProjectPage from "../pages/Project/ProjectPage";
import TaskDetailPage from "../pages/Task/TaskDetailPage";
import TaskPage from "../pages/Task/TaskPage";

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <NotFoundPage />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: ProjectPage,
});

export const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$projectId", // $ indique un paramètre dynamique
  component: ProjectDetailComponent,
});

const taskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tasks",
  component: TaskPage,
});

export const taskDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tasks/$taskId",
  component: TaskDetailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  projectRoute,
  projectDetailRoute,
  taskRoute,
  taskDetailRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultStaleTime: 5000,
  scrollRestoration: true,
});
