"use client"
import { X, ArrowRight } from "lucide-react"
import styles from "../page.module.scss"

interface SearchNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchNav = ({ isOpen, onClose }: SearchNavProps) => {
  return (
    <div className={`${styles.searchNav} ${isOpen ? styles.open : ''}`}>
      <button className={styles.closeButton} onClick={onClose}>
        <X size={24} />
      </button>
      <input 
        type="search"
        placeholder="Search album covers..."
        className={styles.searchInput}
      />
      <button className={styles.continueButton}>
        <ArrowRight size={24} />
      </button>
    </div>
  )
}

export default SearchNav