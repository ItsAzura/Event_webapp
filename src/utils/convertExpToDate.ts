export const convertExpToDate = (exp: number): string => {
  const date = new Date(exp * 1000); // Chuyển từ giây sang mili-giây
  return date.toLocaleString(); // Định dạng theo locale mặc định
};
