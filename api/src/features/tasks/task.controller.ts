import type { Context } from "hono";
import { getUserId } from "../../middlewares/authMiddleware";
import { taskService } from "./task.service";
import { AppError } from "../../core/errors";

export const taskController = {
  async getAll(c: Context) {
    const userId = getUserId(c);

    try {
      const tasks = await taskService.getAll(userId);
      return c.json({ tasks });
    } catch (err) {
      console.error(err);
      return c.json({ error: err }, 404);
    }
  },

  async getById(c: Context) {
    const taskId = Number(c.req.param("taskId"));

    try {
      const task = await taskService.getById(taskId);
      return c.json({ task }, 200);
    } catch (err) {
      console.error(err);
      // on check l'instance de l'erreur pour retourner le message d'erreur correct
      // la gestion d'erreur est automatiser via la classe d'erreur
      // selon le throw new avec la classe, on retourne le bon message d'erreur
      if (err instanceof AppError) {
        return c.json({ error: err.message }, err.statusCode);
      }
      // si erreur Drizzle ou non prévu, on retourne l'erreur directemnt
      return c.json({ error: "Erreur interne" }, 500);
    }
  },
};
