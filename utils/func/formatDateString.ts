export const formatDateString = (date: Date | string | undefined, format: string): string => {
  if (!date) {
    return '';
  }

  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const day: string = String(date.getDate()).padStart(2, '0');
  const month: string = String(date.getMonth() + 1).padStart(2, '0');
  const year: number = date.getFullYear();
  const hours: string = String(date.getHours()).padStart(2, '0');
  const minutes: string = String(date.getMinutes()).padStart(2, '0');
  const seconds: string = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('dd', day)
    .replace('mm', month)
    .replace('yyyy', year.toString())
    .replace('YYYY', year.toString())
    .replace('HH', hours)
    .replace('MM', minutes)
    .replace('SS', seconds);
};
