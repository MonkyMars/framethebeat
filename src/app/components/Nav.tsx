"use client"
import { Menu, Search } from "lucide-react";
import styles from "../page.module.scss";
import { useState } from "react";
import Aside from "./Aside";
import SearchNav from "./SearchNav";
import Link from "next/link";
import { useAuth } from "../utils/AuthContext";

const Nav = () => {
    const [isAsideOpen, setIsAsideOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
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

                <Link href="/collection" prefetch>Collection</Link>
                <Link href="/saved" prefetch>Saved</Link>
                <Link href="/tours" prefetch>Tours</Link>
            </ul>
            <ul>
                <li>{!session ? <Link href="/login" prefetch>Log in</Link> : <Link href="/settings" prefetch>Settings</Link>}</li>
            </ul>
          </nav>
          
          <Aside isOpen={isAsideOpen} onClose={() => setIsAsideOpen(false)} user={session?.user.email} />
          <SearchNav isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}

export default Nav;