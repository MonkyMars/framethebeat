"use client"
import { Menu, Search } from "lucide-react";
import styles from "../page.module.scss";
import { useState } from "react";
import Aside from "./Aside";
import SearchNav from "./SearchNav";
import { useRouter } from "next/navigation";
const Nav = () => {
    const [isAsideOpen, setIsAsideOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const router = useRouter();
    return(
        <>
          <nav className={styles.Nav}>
            <ul>
              <li onClick={() => setIsAsideOpen(true)}>
                <Menu size={32} aria-label="Open menu" />
              </li>
              <li onClick={() => setIsSearchOpen(true)}>
                <Search size={32} aria-label="Search" />
              </li>

              <label onClick={() => router.push('/collection')}>Collection</label>
              <label onClick={() => router.push('/saved')}>Saved</label>
            </ul>
            <ul>
              <span onClick={() => router.push('/login')}>Log in</span>
            </ul>
          </nav>
          
          <Aside isOpen={isAsideOpen} onClose={() => setIsAsideOpen(false)} />
          <SearchNav isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}

export default Nav;