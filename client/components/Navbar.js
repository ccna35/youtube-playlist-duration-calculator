import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Navbar = () => {
  return (
    <nav>
      <div className={styles.container}>
        <div className={styles.navbar}>
          <div className={styles.title}>YT Playlist Duration Calculator</div>
          <div className={styles.nav__menu}>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
