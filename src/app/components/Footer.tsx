import styles from "../page.module.scss";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        &copy; 2024 Frame The Beat. All rights reserved.
      </p>
      <ul>
        <li>
          <Link href="/privacy">Privacy Policy</Link>
        </li>
        <li>
          <Link href="/terms">Terms of Service</Link>
        </li>
        <li>
          <Link href="https://github.com/MonkyMars/framethebeat/tree/master" target="_blank">Source code</Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;