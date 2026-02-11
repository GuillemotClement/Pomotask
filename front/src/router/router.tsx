import {
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import RootLayout from "../layouts/RootLayout";

import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ProjectPage from "../pages/Project/ProjectPage";
import ProjectDetailComponent from "../pages/Project/ProjectDetailComponent";

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

const routeTree = rootRoute.addChildren([
	indexRoute,
	loginRoute,
	registerRoute,
	projectRoute,
	projectDetailRoute,
]);

export const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	defaultStaleTime: 5000,
	scrollRestoration: true,
});
