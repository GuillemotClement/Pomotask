import { NotFoundError, UnprocessableEntity } from "../../core/errors";
import type {
	Task,
	TaskDetailResponse,
	UpdateTaskPayload,
} from "../../types/task";
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

	async update(taskId: number, payload: UpdateTaskPayload) {
		const isValidTask = await taskService.getById(taskId);
		if (!isValidTask) {
			throw new NotFoundError();
		}

		const result = await taskRepository.update(payload);
		if (!result) {
			throw new UnprocessableEntity();
		}

		const response: Task = {
			id: result.id,
			title: result.title,
			description: result.description,
			createdAt: result.createdAt.toISOString(),
			updatedAt: result.updatedAt.toISOString(),
			statusId: result.statusId,
			branche: result.branche || null,
			projectId: result.projectId || null,
		};

		return response;
	},

	async create(userId: string, payload) {
		const data = {
			userId,
			...payload,
		};

		const response = await taskRepository.create(data);
		if (!response) {
			throw new Error("Faled to insert new task");
		}

		return response;
	},

	async delete(taskId: number) {
		await taskRepository.delete(taskId);
	},

	async updateStatus(taskId: number, statusId: number) {
		const response = await taskRepository.updateStatus(taskId, statusId);
		if (!response) {
			throw new Error("Failed to update status");
		}

		return response;
	},
};
