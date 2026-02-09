import { api } from "../lib/axios";

export const apiHook = {
  async getAll<T>(endpoint: string): Promise<T | null>{
    try{
      console.log("envoie d'une requête")
      const res = await api.get<T>(endpoint);
      return res.data;
    }catch(err){
      console.error("Failed to fetch data: ", err);
      return null;
    }
  }
}