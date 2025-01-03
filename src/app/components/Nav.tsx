"use client"
import { Menu, Search } from "lucide-react";
import styles from "../page.module.scss";
import { useState } from "react";
import Aside from "./Aside";
import SearchNav from "./SearchNav";
import { useRouter } from "next/navigation";
import { useAuth } from "../utils/AuthContext";

const Nav = () => {
    const [isAsideOpen, setIsAsideOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const router = useRouter();
    const { session } = useAuth();

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
              <label onClick={() => router.push('/tours')}>Tours</label>
            </ul>
            <ul>
              {!session ? <span onClick={() => router.push('/login')}>Log in</span> : <span onClick={() => router.push('/settings')}>Settings</span>}
            </ul>
          </nav>
          
          <Aside isOpen={isAsideOpen} onClose={() => setIsAsideOpen(false)} user={session?.user.email} />
          <SearchNav isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}

export default Nav;