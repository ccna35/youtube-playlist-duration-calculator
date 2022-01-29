import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Navbar = () => {
  const newDate = new Date();
  const year = newDate.getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>All Rights Reserved &#169; {year}</div>
      </div>
    </footer>
  );
};

export default Navbar;
