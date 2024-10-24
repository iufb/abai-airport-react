import { useEffect } from "react";
import { useState } from "react";
import styles from "./PoweredBy.module.css";
import clsx from "clsx";
const logos = ["/logos/1.jpg", "/logos/2.webp"];
const names = ["Abai IT Valley", "FoxMinded"];
export const PoweredBy = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === logos.length - 1 ? 0 : prev + 1));
    }, 7 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.wrapper}>
      <span>Powered by</span>
      <div className={clsx(styles.logoWrapper)}>
        <img
          src={logos[current]}
          alt="sponsor"
          className={clsx(styles.logo, styles["fade-in-out"])}
        />
      </div>
    </div>
  );
};
