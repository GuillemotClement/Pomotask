import { taskRepository } from "./task.repository";

export const taskService = {
  async getAll(userId: string) {
    return await taskRepository.getAll(userId);
  },
};
