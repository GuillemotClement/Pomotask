import { eq, and } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { tableProject, tableStatusTask, tableTask } from "./db/schema";
import { auth } from "./lib/auth"; // path to your auth file
import { db } from "./lib/drizzle";
import { authMiddleware, getUserId } from "./middlewares/authMiddleware";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());

app.use(
  "/api/*",
  cors({
    origin: "http://localhost:5173",
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Custom-Header",
      "Upgrade-Insecure-Requests",
    ],
    allowMethods: ["POST", "GET", "OPTIONS", "PATCH", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/api/tasks", authMiddleware, async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json();

  console.log(body);

  const payload = {
    title: body.title,
    description: body.description,
    userId: userId,
    projectId: body.projectId,
    branche: body.branche,
  };

  console.log(payload);

  try {
    const result = await db.insert(tableTask).values(payload);
    console.log("Insertion réussie");
    return c.json({ status: "OK", data: [result] }, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: err }, 500);
  }
});

app.get("/api/tasks", authMiddleware, async (c) => {
  const userId = getUserId(c);
  console.log("requête reçu");
  try {
    const result = await db
      .select({
        id: tableTask.id,
        title: tableTask.title,
        description: tableTask.description,
        status: tableStatusTask.title,
        statusId: tableTask.statusId,
        projectId: tableTask.projectId,
        project: tableProject.title,
        createdAt: tableTask.createdAt,
        branche: tableTask.branche,
      })
      .from(tableTask)
      .innerJoin(tableStatusTask, eq(tableTask.statusId, tableStatusTask.id))
      .leftJoin(tableProject, eq(tableTask.projectId, tableProject.id))
      .where(eq(tableTask.userId, userId))
      .orderBy(tableTask.id);

    console.log(result);
    // stadard REST
    return c.json({ tasks: result });
  } catch (err) {
    console.error(err);
    return c.json({ status: "HS", error: err }, 500);
  }
});

app.get("/api/tasks/:projectId", authMiddleware, async (c) => {
  const userId = getUserId(c);
  const projectId = Number(c.req.param("projectId"));

  try {
    const result = await db
      .select({
        id: tableTask.id,
        title: tableTask.title,
        description: tableTask.description,
        status: tableStatusTask.title,
        statusId: tableTask.statusId,
        projectId: tableTask.projectId,
        project: tableProject.title,
        createdAt: tableTask.createdAt,
        branche: tableTask.branche,
      })
      .from(tableTask)
      .innerJoin(tableStatusTask, eq(tableTask.statusId, tableStatusTask.id))
      .leftJoin(tableProject, eq(tableTask.projectId, tableProject.id))
      .where(
        and(eq(tableTask.userId, userId), eq(tableTask.projectId, projectId)),
      )
      .orderBy(tableTask.updatedAt);

    return c.json({ tasks: result });
  } catch (err) {
    console.error(err);
    return c.json({ error: err }, 500);
  }
});

app.get("/api/status-task", authMiddleware, async (c) => {
  try {
    const result = await db.select().from(tableStatusTask);
    return c.json({ status: result });
  } catch (err) {
    console.error(err);
    return c.json({ error: err }, 500);
  }
});

// PUT => dans le cas d'une mise à jour complète de la ressource
// mise à jour partielle => Convention REST
app.patch("/api/tasks/status/:id", authMiddleware, async (c) => {
  const taskId = c.req.param("id");

  const body = await c.req.json();

  const statusId = Number(body.statusId);

  try {
    await db
      .update(tableTask)
      .set({ statusId })
      .where(eq(tableTask.id, Number(taskId)));
    return c.json({ message: "Update réussie" }, 201);
  } catch (err) {
    console.error(err);
    return c.json({ message: "Echec de la mise à jour", error: err }, 500);
  }
});

app.delete("/api/tasks/:id", authMiddleware, async (c) => {
  const taskId = Number(c.req.param("id"));

  try {
    await db.delete(tableTask).where(eq(tableTask.id, taskId));

    return c.json({ message: "Delete réussie" }, 200);
  } catch (err) {
    console.error(err);
    return c.json({ message: "Echec de la suppression", error: err }, 500);
  }
});

app.post("/api/projects", authMiddleware, async (c) => {
  const userId = getUserId(c);

  const data = await c.req.json();

  const payload = {
    title: data.title,
    description: data.description ?? null,
    projectId: data.projectId ?? null,
    userId,
  };

  try {
    await db.insert(tableProject).values(payload);
    return c.json({ message: "Création réussie" }, 201);
  } catch (err) {
    console.error("Echec de création d'un projet");
    return c.json({ error: err }, 500);
  }
});

app.get("api/projects", authMiddleware, async (c) => {
  const userId = getUserId(c);

  try {
    const result = await db
      .select({
        id: tableProject.id,
        title: tableProject.title,
        description: tableProject.description,
        createdAt: tableProject.createdAt,
      })
      .from(tableProject)
      .where(eq(tableProject.userId, userId));
    return c.json({ projects: result });
  } catch (err) {
    console.error(err);
    return c.json({ error: err }, 500);
  }
});

app.delete("/api/projects/:id", authMiddleware, async (c) => {
  const userId = getUserId(c);
  const projectId = Number(c.req.param("id"));

  const isValidProject = await checkIsUserProject(projectId, userId);

  if (!isValidProject) {
    return c.json({ error: "Project not found" }, 404);
  }

  try {
    await db.delete(tableProject).where(eq(tableProject.id, projectId));
    return c.json({ message: "Project delete" }, 200);
  } catch (err) {
    console.error(err);
    return c.json({ error: err }, 500);
  }
});

app.get("/api/projects/:id", authMiddleware, async (c) => {
  const userId = getUserId(c);
  const projectId = Number(c.req.param("id"));

  const isValidProject = await checkIsUserProject(projectId, userId);

  if (!isValidProject) {
    return c.json({ error: "Project not found" }, 404);
  }

  try {
    const [result] = await db
      .select()
      .from(tableProject)
      .where(eq(tableProject.id, projectId));
    return c.json({ project: result }, 200);
  } catch (err) {
    console.error(err);
    return c.json({ error: err }, 500);
  }
});

const checkIsUserProject = async (projectId: number, userId: string) => {
  const isValidProject = await db
    .select()
    .from(tableProject)
    .where(
      and(eq(tableProject.userId, userId), eq(tableProject.id, projectId)),
    );

  return isValidProject;
};

export default app;
