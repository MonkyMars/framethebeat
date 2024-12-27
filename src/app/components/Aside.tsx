import styles from "../page.module.scss";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
interface AsideProps {
  isOpen: boolean;
  user: string | undefined;
  onClose: () => void;
}

const Aside = ({ isOpen, onClose, user }: AsideProps) => {
  const router = useRouter();
  return (
    <aside className={`${styles.aside} ${isOpen ? styles.open : ""}`}>
      <button onClick={onClose} className={styles.closeButton}>
        <X size={24} />
      </button>
      <nav>
        <ul>
          <li onClick={() => router.push("/")}>Home</li>
          <li onClick={() => router.push("/collection")}>Collection</li>
          <li onClick={() => router.push("/saved")}>Saved</li>
          {user && <li onClick={() => router.push("/settings")}>Settings</li>}
          <li onClick={() => router.push("/tours")}>Tours</li>
        </ul>
        <ul>
          {!user ? (
            <>
              <span onClick={() => router.push("/login")}>Log in</span>
              <span onClick={() => router.push("/register")}>Sign up</span>
            </>
          ) : (
            <>
             <span>Logged in as: {user}</span>
             <span onClick={() => router.push("/settings")}>Settings</span>
            </>
           
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Aside;
