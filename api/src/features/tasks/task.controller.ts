import type { Context } from "hono";
import { getUserId } from "../../middlewares/authMiddleware";
import { taskService } from "./task.service";

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
};
