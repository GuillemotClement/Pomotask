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
