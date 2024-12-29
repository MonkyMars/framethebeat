"use client";
import { X, ArrowRight } from "lucide-react";
import styles from "../page.module.scss";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface SearchNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchNav = ({ isOpen, onClose }: SearchNavProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
    }
  }, [query]);

  const handleSearch = () => {
    router.push(`/collection?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className={`${styles.searchNav} ${isOpen ? styles.open : ""}`}>
      <button className={styles.closeButton} onClick={onClose}>
        <X size={24} />
      </button>
      <input
        type="search"
        placeholder="Search album covers..."
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className={styles.continueButton} onClick={handleSearch}>
        <ArrowRight size={24} />
      </button>
    </div>
  );
};

const SearchComponent = ({ isOpen, onClose }: SearchNavProps) => {
  return <Suspense><SearchNav isOpen={isOpen} onClose={onClose} /></Suspense>;
}

export default SearchComponent;
