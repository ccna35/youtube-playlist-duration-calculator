import styles from "../styles/Home.module.css";

const Spinner = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles.spinner_circle}></div>
    </div>
  );
};

export default Spinner;
