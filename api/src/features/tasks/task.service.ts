import { NotFoundError } from "../../core/errors";
import { TaskDetailResponse } from "../../types/task";
import { taskRepository } from "./task.repository";

export const taskService = {
  async getAll(userId: string) {
    return await taskRepository.getAll(userId);
  },

  async getById(taskId: number): Promise<TaskDetailResponse> {
    const rowData = await taskRepository.getById(taskId);

    if (!rowData) {
      throw new NotFoundError("Task not found");
    }

    const data: TaskDetailResponse = {
      id: rowData.id,
      title: rowData.title,
      description: rowData.description,
      createdAt: rowData.createdAt.toISOString(),
      updatedAt: rowData.updatedAt?.toISOString() || null,
      statusId: rowData.statusId,
      status: rowData.status,
      branche: rowData.branche || null,
      projectId: rowData.projectId || null,
      project: rowData.project || null,
    };

    return data;
  },
};
