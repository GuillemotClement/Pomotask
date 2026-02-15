export type Task = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  statusId: number;
  status: string;
  branche: string;
  projectId: number | null;
  project: string | null;
};

// typage pour TanstackQuery
export type TaskDetailResponse = {
  task: Task;
};
