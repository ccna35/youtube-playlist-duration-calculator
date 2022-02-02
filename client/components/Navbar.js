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
            width={107.484667 * 3}
            height={34.2116667 * 3}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
