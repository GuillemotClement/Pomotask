
export const checker = {
  isEmptyArray(data: array){
    if(!data || Array.isArray(data) || data.length === 0){
      return true;
    }
    console.error('Data is not valid array')
    return false;
  }
}