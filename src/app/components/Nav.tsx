"use client";
import "../globals.css";
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import SearchNav from "./SearchNav";
import Link from "next/link";
import { useAuth } from "../utils/AuthContext";
import Aside from "./Aside";

const Nav = () => {
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { session } = useAuth();

  return (
    <>
      <nav className="flex justify-between items-center w-full text-foreground p-4 h-16">
        <ul className="flex gap-4 pl-2 ">
          <li onClick={() => setIsAsideOpen(true)}>
            <Menu
              size={32}
              aria-label="Open menu"
              className="cursor-pointer hover:text-theme  transition-all duration-200 "
            />
          </li>
          <li onClick={() => setIsSearchOpen(true)}>
            <Search
              size={32}
              aria-label="Search"
              className="cursor-pointer hover:text-theme  transition-all duration-200"
            />
          </li>
          <li>
            <Link
              href="/collection"
              prefetch
              className="hidden sm:block px-4 py-2 text-base font-medium uppercase transition-all duration-300 hover:bg-[rgba(209,126,59,0.1)] hover:text-theme hover:scale-105 rounded-md text-gray-500"
            >
              Collection
            </Link>
          </li>
          <li>
            <Link
              href="/saved"
              prefetch
              className="hidden sm:block px-4 py-2 text-base font-medium uppercase transition-all duration-300 hover:bg-[rgba(209,126,59,0.1)] hover:text-theme hover:scale-105 rounded-md text-gray-500"
            >
              Saved
            </Link>
          </li>
          <li>
            <Link
              href="/tours"
              prefetch
              className="hidden sm:block px-4 py-2 text-base font-medium uppercase transition-all duration-300 hover:bg-[rgba(209,126,59,0.1)] hover:text-theme hover:scale-105 rounded-md text-gray-500"
            >
              Tours
            </Link>
          </li>
        </ul>
        <ul className="flex justify-end pr-4 gap-2">
          <li>
            {!session ? (
              <Link
                href="/login"
                prefetch
                className="hidden sm:block px-4 py-2 text-base font-medium uppercase transition-all duration-300 hover:bg-[rgba(209,126,59,0.1)] hover:text-theme hover:scale-105 rounded-md text-gray-500"
              >
                Log in
              </Link>
            ) : (
              <Link
                href="/settings"
                prefetch
                className="hidden sm:block px-4 py-2 text-base font-medium uppercase transition-all duration-300 hover:bg-[rgba(209,126,59,0.1)] hover:text-theme hover:scale-105 rounded-md text-gray-500"
              >
                Settings
              </Link>
            )}
          </li>
        </ul>
      </nav>

      <Aside
        isOpen={isAsideOpen}
        onClose={() => setIsAsideOpen(false)}
        user={session?.user.email}
      />
      <SearchNav isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Nav;
