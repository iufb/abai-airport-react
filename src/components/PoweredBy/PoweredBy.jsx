import { useEffect } from "react";
import { useState } from "react";
import styles from "./PoweredBy.module.css";
import clsx from "clsx";
const logos = ["/logos/1.jpg", "/logos/2.jpeg"];
const names = ["Abai IT Valley", "FoxMinded"];
export const PoweredBy = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState("in");
  useEffect(() => {
    const interval = setInterval(() => {
      setFade("out");
      setTimeout(() => {
        setCurrent((prev) => (prev === logos.length - 1 ? 0 : prev + 1));
        setFade("in");
      }, 3000);
    }, 5 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.wrapper}>
      <span>Powered by</span>
      <div
        className={clsx(
          fade == "in" ? styles.in : styles.out,
          styles.logoWrapper,
        )}
      >
        <img src={logos[current]} alt="sponsor" className={clsx(styles.logo)} />
        <span>{names[current]}</span>
      </div>
    </div>
  );
};
