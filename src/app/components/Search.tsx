import styles from "../page.module.scss";

const SearchComponent = () => {
  return (
    <section className={styles.section}>
      <h2>Search Album Covers</h2>
      <input type="text" placeholder="Search by album, artist, or genre" />
    </section>
  );
};

export default SearchComponent;
