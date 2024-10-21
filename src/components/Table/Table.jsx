import styles from "./Table.module.css";
export const Table = ({ head, body }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {head.map((h, idx) => (
            <td className={styles.td} key={idx}>
              {h}
            </td>
          ))}
        </tr>
      </thead>
      <tbody className={styles.body}>
        {body.map((row, idx) => (
          <tr key={idx}>
            {row.map((cell, idx) => (
              <td className={styles.td} key={idx}>
                {formatCell(cell)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const formatCell = (cell) => {
  if (cell.replace(" ", "").trim() == "FlyArystan") {
    return <CellWithImage img="/flyarystan.png" cell={cell} />;
  }
  if (
    cell.trim() == "Южное небо" ||
    cell == "Southern sky" ||
    cell == "Оңтүстік аспаны"
  ) {
    return <CellWithImage img="/hisky.png" cell={cell} />;
  }
  return cell;
};

const CellWithImage = ({ img, cell }) => {
  return (
    <section className={styles.cell}>
      <img src={img} alt="companylogo" />
      <span>{cell}</span>
    </section>
  );
};
