import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Navbar = () => {
  return (
    <nav>
      <div className={styles.container}>
        <div className={styles.navbar}>
          <Image
            src="/YT playlist calculator logo.svg"
            width={322.454001}
            height={102.635}
            alt="logo"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
