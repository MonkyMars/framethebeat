import styles from "../page.module.scss";
import React from "react";
interface BannerProps {
    title: string;
    subtitle: string;
}

const Banner: React.FC<BannerProps> = ({title, subtitle}) => {
    return(
        <section className={styles.banner}>
            <h3>{title}</h3>
            <p>{subtitle}</p>
        </section>
    )
}

export default Banner;