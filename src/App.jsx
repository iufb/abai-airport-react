import { useState } from "react";
import styles from "./App.module.css";
import { PoweredBy, Schedule } from "./components";
import { langs } from "./utils";

function App() {
  const [lang, setLang] = useState(1);
  return (
    <>
      <Schedule lang={lang} setLang={setLang} />
      <img src={`/cropped-${langs[lang]}.jpg`} className={styles.img} />
      <PoweredBy />
    </>
  );
}

export default App;
