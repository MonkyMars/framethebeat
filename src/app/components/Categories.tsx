import styles from "../page.module.scss";
import { useRouter } from "next/navigation";
import { knownGenres } from "../utils/functions";

const Categories = () => {
    const router = useRouter();
    return(
        <section className={styles.section}>
        <h2>Explore by Category</h2>
        <ul>
          {knownGenres.slice(0, 10).map((genre, index) => (
            <li key={`genre-${genre}-${index}`} onClick={() => router.push(`/collection?q=${genre}`)}>
              <span>{genre}</span>
            </li>
          ))}
        </ul>
      </section>
    )
}

export default Categories;