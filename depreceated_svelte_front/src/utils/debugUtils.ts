export const debugUtils = {
  async sleep(delay: number){
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}