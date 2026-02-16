export type TaskDetailResponse = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  statusId: number;
  status: string;
  branche: string | null;
  projectId: number | null;
  project: string | null;
};

export type UpdateTaskPayload = {
  id: number;
  title: string;
  branche: string | null;
  projectId: number;
  statusId: number;
  description: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  statusId: number;
  branche: string | null;
  projectId: number | null;
};
