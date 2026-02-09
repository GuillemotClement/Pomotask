export const dateUtils = {
  formatDateFr(inputDate: string){
    const date = new Date(inputDate);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}