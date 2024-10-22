import { useEffect, useState } from "react";
import styles from "./Schedule.module.css";
import { formatData, getToday, labels, langs } from "../../utils";
import { Table } from "../";
const fetchData = async () => {
  return fetch("https://maksat.gotdns.ch/parse_main")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error");
      }
      return res.json();
    })
    .catch((e) => {
      // alert("Error");
      console.log(e);
    });
};
export function Schedule({ lang, setLang }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData().then((data) => {
      setData(data[lang]);
    });
    const interval = setInterval(() => {
      fetchData().then((data) => {
        setLang((prev) => {
          const val = prev === langs.length - 1 ? 0 : prev + 1;
          fetchData().then((data) => setData(data[val]));
          return val;
        });
      });
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.day}>{getToday(langs[lang])}</h1>
      {data.map((day, idx) => {
        const { head, body } = formatData(day);
        return (
          <div key={idx} className={styles.tableWrapper}>
            <div className={styles.label}>
              <img
                style={idx == 0 ? { rotate: "80deg" } : { rotate: "10deg" }}
                src={"/plane.svg"}
              />
              <h2>{labels[langs[lang]][idx]}</h2>
            </div>
            <Table head={head} body={body} />
          </div>
        );
      })}
    </section>
  );
}
