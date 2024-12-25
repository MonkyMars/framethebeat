import styles from "../page.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        &copy; {new Date().getFullYear()} Frame The Beat. All rights reserved.
      </p>
      <ul>
        <li>
          <a href="/privacy">Privacy Policy</a>
        </li>
        <li>
          <a href="/terms">Terms of Service</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
