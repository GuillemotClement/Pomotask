import { eq } from "drizzle-orm";
import { tableProject, tableStatusTask, tableTask } from "../../db/schema";
import { db } from "../../lib/drizzle";
import type { UpdateTaskPayload } from "../../types/task";

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

  async update(data: UpdateTaskPayload) {
    const [row] = await db
      .update(tableTask)
      .set({
        title: data.title,
        branche: data.branche,
        description: data.description,
        projectId: data.projectId,
        statusId: data.statusId,
      })
      .where(eq(tableTask.id, data.id))
      .returning();

    return row || null;
  },

  async create(data) {
    const [row] = await db.insert(tableTask).values(data).returning();

    return row || null;
  },

  async delete(taskId: number) {
    await db.delete(tableTask).where(eq(tableTask.id, taskId));
  },
};
