import { useEffect, useState } from "react";
import styles from "./Schedule.module.css";
import { getToday, labels, langs } from "../../utils";
import { fetchFlights, toTables } from "../../utils/flights";
import { Table } from "../";

const offlineText = {
  ru: "Нет связи с сервером аэропорта",
  kz: "Әуежай серверімен байланыс жоқ",
  en: "Cannot reach the airport server",
};

const emptyText = {
  ru: "Рейсов нет",
  kz: "Рейс жоқ",
  en: "No flights",
};

export function Schedule({ lang, setLang }) {
  const [flights, setFlights] = useState(null);
  const [offline, setOffline] = useState(false);
  const code = langs[lang];

  useEffect(() => {
    let active = true;
    let loading = false;

    const load = async () => {
      if (loading) return;
      loading = true;
      try {
        const next = await fetchFlights();
        if (!active) return;
        setFlights(next);
        setOffline(false);
      } catch {
        if (!active) return;
        setOffline(true);
      } finally {
        loading = false;
      }
    };

    load();
    const refresh = setInterval(load, 30 * 1000);
    const rotate = setInterval(() => {
      setLang((prev) => (prev === langs.length - 1 ? 0 : prev + 1));
    }, 60 * 1000);

    return () => {
      active = false;
      clearInterval(refresh);
      clearInterval(rotate);
    };
  }, [setLang]);

  const tables = flights ? toTables(flights, code) : [];

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.day}>{getToday(code)}</h1>
      {offline && !flights ? <p className={styles.offline}>{offlineText[code]}</p> : null}
      {tables.map((table, idx) => (
        <div key={idx} className={styles.tableWrapper}>
          <div className={styles.label}>
            <img
              style={idx === 0 ? { rotate: "80deg" } : { rotate: "10deg" }}
              src="/plane.svg"
              alt=""
            />
            <h2>{labels[code][idx]}</h2>
          </div>
          {table.body.length === 0 ? (
            <p className={styles.empty}>{emptyText[code]}</p>
          ) : (
            <Table head={table.head} body={table.body} />
          )}
        </div>
      ))}
    </section>
  );
}
