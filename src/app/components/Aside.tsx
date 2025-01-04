import styles from "../page.module.scss";
import { X } from "lucide-react";
import Link from "next/link";

interface AsideProps {
  isOpen: boolean;
  user: string | undefined;
  onClose: () => void;
}

const Aside = ({ isOpen, onClose, user }: AsideProps) => {
  return (
    <aside className={`${styles.aside} ${isOpen ? styles.open : ""}`}>
      <button onClick={onClose} className={styles.closeButton}>
        <X size={24} />
      </button>
      <nav>
        <ul>
            <Link href="/" prefetch={true}>Home</Link>
            <Link href="/collection" prefetch={true}>Collection</Link>
            <Link href="/saved" prefetch={true}>Saved</Link>
            {user && <Link href="/settings" prefetch={true}>Settings</Link>}
            <Link href="/tours" prefetch={true}>Tours</Link>
        </ul>
        <ul>
            {!user ? (
            <>
              <Link href="/login" prefetch={true}>Log in</Link>
              <Link href="/register" prefetch={true}>Sign up</Link>
            </>
            ) : (
            <>
             <span>Logged in as: {user}</span>
             <Link href="/settings" prefetch={true}>Settings</Link>
            </>
            )}
        </ul>
      </nav>
    </aside>
  );
};

export default Aside;
