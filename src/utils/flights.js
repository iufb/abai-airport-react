const AIRPORT_TZ = "Asia/Almaty";

const HEADS = {
  ru: {
    arrival: ["Авиакомпания", "Рейс", "Откуда", "План", "Факт", "Статус"],
    departure: ["Авиакомпания", "Рейс", "Куда", "План", "Факт", "Статус"],
  },
  kz: {
    arrival: ["Авиакомпания", "Рейс", "Қайдан", "Жоспар", "Нақты", "Мәртебе"],
    departure: ["Авиакомпания", "Рейс", "Қайда", "Жоспар", "Нақты", "Мәртебе"],
  },
  en: {
    arrival: ["Airline", "Flight", "From", "Scheduled", "Actual", "Status"],
    departure: ["Airline", "Flight", "To", "Scheduled", "Actual", "Status"],
  },
};

const STATUS = {
  ru: {
    scheduled: "По расписанию",
    checkin: "Регистрация",
    boarding: "Посадка",
    departed: "Вылетел",
    delayed: "Задержан",
    cancelled: "Отменён",
    landing: "Заходит на посадку",
    landed: "Произвёл посадку",
    arrived: "Прибыл",
  },
  kz: {
    scheduled: "Кесте бойынша",
    checkin: "Тіркелу",
    boarding: "Отыру",
    departed: "Ұшып кетті",
    delayed: "Кешіктірілді",
    cancelled: "Болдырылмады",
    landing: "Қону алдында",
    landed: "Қонды",
    arrived: "Жетті",
  },
  en: {
    scheduled: "On schedule",
    checkin: "Check-in",
    boarding: "Boarding",
    departed: "Departed",
    delayed: "Delayed",
    cancelled: "Cancelled",
    landing: "Landing",
    landed: "Landed",
    arrived: "Arrived",
  },
};

const CITIES = {
  ru: {
    astana: "Астана",
    "nur-sultan": "Астана",
    almaty: "Алматы",
    karagandy: "Караганда",
    karaganda: "Караганда",
    urzhar: "Урджар",
  },
  kz: {
    astana: "Астана",
    "nur-sultan": "Астана",
    almaty: "Алматы",
    karagandy: "Қарағанды",
    karaganda: "Қарағанды",
    urzhar: "Үржар",
  },
  en: {
    astana: "Astana",
    "nur-sultan": "Astana",
    almaty: "Almaty",
    karagandy: "Karagandy",
    karaganda: "Karagandy",
    urzhar: "Urzhar",
  },
};

const AIRLINES = {
  ru: { "hi sky": "Южное небо" },
  kz: { "hi sky": "Оңтүстік аспаны" },
  en: { "hi sky": "Southern sky" },
};

const clock = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: AIRPORT_TZ,
});

const dayKey = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: AIRPORT_TZ,
});

const formatClock = (iso) => {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return clock.format(date);
};

const normalize = (flight) => {
  const scheduledAt = flight.scheduledTime ? new Date(flight.scheduledTime) : null;
  const updatedAt = flight.updatedAt ? new Date(flight.updatedAt).getTime() : 0;

  return {
    flightNumber: String(flight.flightNumber ?? "").trim(),
    airlineName: String(flight.airlineName ?? "").trim(),
    city: String(flight.city ?? "").trim(),
    status: String(flight.status ?? "scheduled").trim(),
    scheduled: formatClock(flight.scheduledTime),
    actual: formatClock(flight.estimatedTime),
    scheduledMs: scheduledAt && !Number.isNaN(scheduledAt.getTime()) ? scheduledAt.getTime() : 0,
    day: scheduledAt && !Number.isNaN(scheduledAt.getTime()) ? dayKey.format(scheduledAt) : "",
    updatedAt: Number.isFinite(updatedAt) ? updatedAt : 0,
  };
};

const dedupe = (flights) => {
  const byNumber = new Map();
  for (const flight of flights) {
    const key = flight.flightNumber.toUpperCase();
    const prev = byNumber.get(key);
    if (!prev || flight.updatedAt >= prev.updatedAt) byNumber.set(key, flight);
  }
  return [...byNumber.values()].sort((a, b) => a.scheduledMs - b.scheduledMs);
};

export async function fetchFlights() {
  const response = await fetch("/api/flights", {
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Flights request failed");

  const payload = await response.json();
  if (!Array.isArray(payload)) throw new Error("Flights payload is not a list");

  const today = dayKey.format(new Date());
  const arrivals = [];
  const departures = [];

  for (const flight of payload) {
    const row = normalize(flight);
    if (row.day !== today) continue;
    if (flight.direction === "departure") departures.push(row);
    else arrivals.push(row);
  }

  return { arrivals: dedupe(arrivals), departures: dedupe(departures) };
}

const cityName = (city, lang) => CITIES[lang]?.[city.toLowerCase()] ?? city;

const airlineName = (name, lang) => AIRLINES[lang]?.[name.toLowerCase()] ?? name;

const statusName = (status, lang) => STATUS[lang]?.[status] ?? status;

const toRow = (flight, lang) => [
  airlineName(flight.airlineName, lang),
  flight.flightNumber,
  cityName(flight.city, lang),
  flight.scheduled,
  flight.actual,
  statusName(flight.status, lang),
];

export const toTables = (flights, lang) => [
  {
    head: HEADS[lang].arrival,
    body: flights.arrivals.map((flight) => toRow(flight, lang)),
  },
  {
    head: HEADS[lang].departure,
    body: flights.departures.map((flight) => toRow(flight, lang)),
  },
];
