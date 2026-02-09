export const fetchData = {
  async getAll(){},

  async createData(){},

  async deleteData(){},

  async sleep(delay: number){
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}