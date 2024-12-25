import styles from "../page.module.scss";

const Cta = () => {
  return (
    <section className={styles.section}>
    <h2>Join the Community</h2>
    <p>
      Sign up now to save your favorite album covers and contribute your
      own!
    </p>
    <div className={styles.ctaButtonContainer}>
      <button>Log In</button>
      <button>Sign Up</button>
    </div>
  </section>
  );
};

export default Cta;