import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { taskController } from "./task.controller";

export const taskRouteur = new Hono();

taskRouteur.get("/", authMiddleware, taskController.getAll);

// app.post("/api/tasks", authMiddleware, async (c) => {
//   const userId = getUserId(c);
//   const body = await c.req.json();

//   console.log(body);

//   const payload = {
//     title: body.title,
//     description: body.description,
//     userId: userId,
//     projectId: body.projectId,
//     branche: body.branche,
//   };

//   console.log(payload);

//   try {
//     const result = await db.insert(tableTask).values(payload);
//     console.log("Insertion réussie");
//     return c.json({ status: "OK", data: [result] }, 201);
//   } catch (err) {
//     console.error(err);
//     return c.json({ error: err }, 500);
//   }
// });

// app.get("/api/tasks/:projectId", authMiddleware, async (c) => {
//   const userId = getUserId(c);
//   const projectId = Number(c.req.param("projectId"));

//   try {
//     const result = await db
//       .select({
//         id: tableTask.id,
//         title: tableTask.title,
//         description: tableTask.description,
//         status: tableStatusTask.title,
//         statusId: tableTask.statusId,
//         projectId: tableTask.projectId,
//         project: tableProject.title,
//         createdAt: tableTask.createdAt,
//         branche: tableTask.branche,
//       })
//       .from(tableTask)
//       .innerJoin(tableStatusTask, eq(tableTask.statusId, tableStatusTask.id))
//       .leftJoin(tableProject, eq(tableTask.projectId, tableProject.id))
//       .where(
//         and(eq(tableTask.userId, userId), eq(tableTask.projectId, projectId)),
//       )
//       .orderBy(tableTask.updatedAt);

//     return c.json({ tasks: result });
//   } catch (err) {
//     console.error(err);
//     return c.json({ error: err }, 500);
//   }
// });

// // PUT => dans le cas d'une mise à jour complète de la ressource
// // mise à jour partielle => Convention REST
// app.patch("/api/tasks/status/:id", authMiddleware, async (c) => {
//   const taskId = c.req.param("id");

//   const body = await c.req.json();

//   const statusId = Number(body.statusId);

//   try {
//     await db
//       .update(tableTask)
//       .set({ statusId })
//       .where(eq(tableTask.id, Number(taskId)));
//     return c.json({ message: "Update réussie" }, 201);
//   } catch (err) {
//     console.error(err);
//     return c.json({ message: "Echec de la mise à jour", error: err }, 500);
//   }
// });

// app.delete("/api/tasks/:id", authMiddleware, async (c) => {
//   const taskId = Number(c.req.param("id"));

//   try {
//     await db.delete(tableTask).where(eq(tableTask.id, taskId));

//     return c.json({ message: "Delete réussie" }, 200);
//   } catch (err) {
//     console.error(err);
//     return c.json({ message: "Echec de la suppression", error: err }, 500);
//   }
// });
