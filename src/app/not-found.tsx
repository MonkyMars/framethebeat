import React from "react";
import styles from "./page.module.scss";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const NotFound = () => {
  return (
    <>
      <Nav />
      <main className={styles.notFoundContainer}>
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.subtitle}>Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
          <p className={styles.description}>
            It seems you&apos;ve hit a broken link or the page has been removed.
            Use the button below to navigate back to safety.
          </p>
          <button className={styles.homeButton} >
            Go to Homepage
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
