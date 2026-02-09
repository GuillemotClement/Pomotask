import { api } from "../../../lib/axios";
import type { Project } from "../../../types/project";

export const projectHooks = {
  async getAll(): Promise<Project[]>{
    try{
      const res = await api.get("/projects");
      return res.data.projects;
    }catch(err){
      console.error("Failed to fetch project: ", err);
      return [];
    }
  }
}