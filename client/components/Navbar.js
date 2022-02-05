import styles from "../styles/Home.module.css";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav>
      <div className={styles.container}>
        <div className={styles.navbar}>
          <h1>YouTube Playlist Duration Calculator</h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
