export const getToday = (lang) => {
  const today = new Date().getDay();
  return days[lang][today];
};
export const labels = {
  ru: ["Прибытие", "Вылет"],
  kz: ["Ұшып келу", "Ұшып шығу"],
  en: ["Arrival", "Departure"],
};
export const langs = ["ru", "kz", "en"];
const days = {
  ru: [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ],
  kz: [
    "Жексенбi",
    "Дүйсенбi",
    "Сейсенбi",
    "Сәрсенбi",
    "Бейсенбi",
    "Жұма",
    "Сенбi",
  ],
  en: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
};
