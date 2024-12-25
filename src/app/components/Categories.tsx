import styles from "../page.module.scss";

const Categories = () => {
    return(
        <section className={styles.section}>
        <h2>Explore by Category</h2>
        <ul>
          <li>
            <span>Rock</span>
          </li>
          <li>
            <span>Pop</span>
          </li>
          <li>
            <span>Hip-Hop</span>
          </li>
          <li>
            <span>Classics</span>
          </li>
        </ul>
      </section>
    )
}

export default Categories;