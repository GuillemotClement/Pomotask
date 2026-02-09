import type { RouteConfig } from "@mateothegreat/svelte5-router";
import Home from "../pages/Home.svelte";
import Login from "../pages/Login.svelte";
import Register from "../pages/Register.svelte";
import CreateTask from "../pages/task/CreateTask.svelte";
import ProjectPage from "../pages/project/ProjectPage.svelte";
import TaskPage from "../pages/task/TaskPage.svelte";



export const routes: RouteConfig[] = [
    { 
        path: '/',
        component: Home
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: "/register",
        component: Register,
    },
    {
        path: '/tasks/create',
        component: CreateTask
    },
    {
        path: '/projects',
        component: ProjectPage
    },
    {
        path: "/tasks",
        component: TaskPage
    }
];