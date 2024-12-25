import styles from "../page.module.scss";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
interface AsideProps {
  isOpen: boolean;
  onClose: () => void;
}

const Aside = ({ isOpen, onClose }: AsideProps) => {
  const router = useRouter();
  return (
    <aside className={`${styles.aside} ${isOpen ? styles.open : ''}`}>
      <button onClick={onClose} className={styles.closeButton}>
        <X size={24} />
      </button>
      <nav>
        <ul>
          <li onClick={() => router.push('/')}>Home</li>
          <li onClick={() => router.push('/collection')}>Collection</li>
          <li onClick={() => router.push('/saved')}>Saved</li>
          <li onClick={() => router.push('/settings')}>Settings</li>
        </ul>
        <ul>
          <span onClick={() => router.push('/login')}>Log in</span>
          <span onClick={() => router.push('/register')}>Sign up</span>
        </ul>
      </nav>
    </aside>
  );
};

export default Aside;