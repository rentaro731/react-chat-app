export const formatTime = (date) => {
  if (!date) return "";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
// 時刻を「HH:MM」形式にフォーマットする関数
