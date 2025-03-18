export const dateFormat = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('vi-VN', options);
};

export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  // Lấy thông tin ngày, tháng, năm, giờ, phút
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Xác định AM hoặc PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Chuyển đổi sang định dạng 12 giờ

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}
