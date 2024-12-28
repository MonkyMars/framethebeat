"use client"
import React from "react";
import { ArrowRight } from "lucide-react";
import styles from "../page.module.scss";
import { useRouter } from "next/navigation";

const SearchComponent = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = React.useState<string>("");

  const handleSearch = () => {
    router.push(`/collection?q=${encodeURIComponent(searchValue)}`);
  };

  return (
    <section className={styles.section}>
      <h2>Search Album Covers</h2>
      <p></p>
      <div className={styles.search}>
        <input type="text" placeholder="Search by album or artist" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        <button onClick={handleSearch}>
          <ArrowRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default SearchComponent;
