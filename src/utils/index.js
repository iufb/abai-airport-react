export const formatData = (data) => {
  const head = data.thead.replace("\n", ";").trim().split(";");
  console.log(data.tbody);

  const body = splitDataArray(data.tbody.replace(/\n/g, ";").trim().split(";"));
  console.log(body);

  return { head, body };
};

const splitDataArray = (values) => {
  const res = [];
  for (let i = 0; i < values.length - 1; i += 6) {
    res.push(values.filter((value) => value !== "").slice(i, i + 6));
  }
  return res;
};
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
