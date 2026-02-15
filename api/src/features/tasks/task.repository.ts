import { eq } from "drizzle-orm";
import { tableProject, tableStatusTask, tableTask } from "../../db/schema";
import { db } from "../../lib/drizzle";
import { TaskDetailResponse } from "../../types/task";
import { updateUser } from "better-auth/api";

export const taskRepository = {
  async getAll(userId: string) {
    return await db
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
  },

  async getById(taskId: number) {
    const [row] = await db
      .select({
        id: tableTask.id,
        title: tableTask.title,
        description: tableTask.description,
        status: tableStatusTask.title,
        statusId: tableTask.statusId,
        projectId: tableTask.projectId,
        project: tableProject.title,
        updatedAt: tableProject.updatedAt,
        createdAt: tableTask.createdAt,
        branche: tableTask.branche,
      })
      .from(tableTask)
      .innerJoin(tableStatusTask, eq(tableTask.statusId, tableStatusTask.id))
      .leftJoin(tableProject, eq(tableTask.projectId, tableProject.id))
      .where(eq(tableTask.id, taskId))
      .limit(1);

    // on retourne la ligne ou null => le service gère la transformation et cas null
    return row || null;
  },
};
