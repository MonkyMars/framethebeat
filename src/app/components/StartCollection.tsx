import styles from "../page.module.scss";
const StartCollection = () => {
    return(
        <section className={styles.section}>
        <h2>For Music Enthusiasts</h2>
        <ul>
          <li>
            <span>Create your own collection of favorites</span>
          </li>
          <li>
            <span>Save album covers for quick access</span>
          </li>
          <li>
            <span>Contribute album art to the community</span>
          </li>
        </ul>
      </section>
    )
}

export default StartCollection;