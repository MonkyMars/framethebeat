import styles from "../page.module.scss";
import { useAuth } from "../utils/AuthContext";
import { useRouter } from "next/navigation";

const Cta = () => {
  const { session } = useAuth();
  const router = useRouter();

  return !session ? (
    <section className={styles.section}>
      <h2>Join the Community</h2>
      <p>
        Sign up now to save your favorite album covers and contribute your own!
      </p>
      <div className={styles.ctaButtonContainer}>
        <button onClick={() => router.push('/login')}>Log In</button>
        <button onClick={() => router.push('/register')}>Sign Up</button>
      </div>
    </section>
  ) : (
    <section className={styles.section}>
      <h2>Welcome!</h2>
      <p>
        Welcome to Frame The Beat! Save your favorite album covers and share
        them with the world.
      </p>
      <div className={styles.ctaButtonContainer}>
        <button onClick={() => router.push('/settings')}>Settings</button>
        <button onClick={() => router.push('/saved')}>Saved album covers</button>
      </div>
    </section>
  );
};

export default Cta;
