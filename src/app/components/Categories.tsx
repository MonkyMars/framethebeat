import styles from "../page.module.scss";
import { useRouter } from "next/navigation";

const Categories = () => {
    const router = useRouter();
    return(
        <section className={styles.section}>
        <h2>Explore by Category</h2>
        <ul>
          <li>
            <span onClick={() => router.push('/collection?q=rock')}>Rock</span>
          </li>
          <li>
            <span onClick={() => router.push('/collection?q=pop')}>Pop</span>
          </li>
          <li>
            <span onClick={() => router.push('/collection?q=hip-hop')}>Hip-Hop</span>
          </li>
          <li>
            <span onClick={() => router.push('/collection?q=soul')}>Soul</span>
          </li>
        </ul>
      </section>
    )
}

export default Categories;