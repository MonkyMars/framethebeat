import '../globals.css'
import { X } from "lucide-react";
import Link from "next/link";
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

interface AsideProps {
  isOpen: boolean;
  user: string | undefined;
  onClose: () => void;
}

const Aside = ({ isOpen, onClose, user }: AsideProps) => {
  const linkClasses = `block w-full px-4 py-3 rounded-lg transition-all duration-300 hover:bg-[rgba(var(--theme-rgb),0.1)]`;
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle keyboard accessibility - close on Escape key
  useEffect(() => {
    if (!mounted) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the first link when menu is opened
      if (firstLinkRef.current) {
        firstLinkRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, mounted]);

  const asideClasses = clsx(
    'fixed top-0 left-0 h-full w-80',
    'bg-[rgba(var(--background-rgb),0.05)]',
    'backdrop-blur-xl shadow-2xl',
    'border-r border-[rgba(var(--theme-rgb),0.2)]',
    'transform transition-all duration-300 ease-out z-50',
    isOpen ? 'translate-x-0' : '-translate-x-full'
  );

  return (
    <>
      {/* Overlay - separate from the aside for proper accessibility */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Aside navigation */}
      <aside
        className={asideClasses}
        aria-label="Main navigation"
        aria-modal={isOpen}
        aria-expanded={isOpen}
        style={{ color: "var(--background) !important" }}
      >
        <div className="flex flex-col h-full p-6 text-[var(--foreground)]">
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--theme)] to-[rgba(var(--theme-rgb),0.8)] bg-clip-text text-transparent">
              Menu
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-all duration-300 hover:bg-[rgba(var(--theme-rgb),0.1)] hover:text-[var(--theme)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--theme-rgb),0.5)] focus:ring-offset-2 focus:ring-offset-[var(--background)]"
              aria-label="Close menu"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </header>

          <nav className="flex-grow bg-gray-100/5 rounded-xl">
            <ul className="space-y-2 mb-8" role="list">
              {[{ href: "/", label: "Home" },
                { href: "/collection", label: "Collection" },
                { href: "/saved", label: "Saved" },
                { href: "/tours", label: "Tours" },
                ...(user ? [{ href: "/settings", label: "Settings" }] : []),
              ]
                .filter(Boolean)
                .map((item, index) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={true}
                      className={linkClasses}
                      aria-current={item.href === "/" ? "page" : undefined}
                      tabIndex={isOpen ? 0 : -1} // Only focusable when menu is open
                      ref={index === 0 ? firstLinkRef : null} // Focus the first link when menu opens
                    >
                      <span className="flex items-center gap-3">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <footer className="pt-6">
            <div className="space-y-4">
              {!user ? (
                <>
                  <Link
                    href="/login"
                    prefetch={true}
                    className={`${linkClasses} text-center`}
                    tabIndex={isOpen ? 0 : -1} // Only focusable when menu is open
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    prefetch={true}
                    className="block w-full px-4 py-3 rounded-lg text-center bg-[var(--theme)] text-[var(--background)] font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[rgba(var(--theme-rgb),0.2)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--theme-rgb),0.5)] focus:ring-offset-2 focus:ring-offset-[var(--background)] hover:transform hover:translate-y-[-2px]"
                    tabIndex={isOpen ? 0 : -1} // Only focusable when menu is open
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="px-4 py-2 rounded-lg bg-[rgba(var(--theme-rgb),0.1)] backdrop-blur-sm">
                    <p className="text-sm text-[var(--foreground)] opacity-80">
                      Logged in as:{" "}
                      <span className="text-[var(--theme)] uppercase font-medium">{user}</span>
                    </p>
                  </div>
                  <Link
                    href="/settings"
                    prefetch={true}
                    className={`${linkClasses} text-center hover:bg-inherit hover:scale-102`}
                    tabIndex={isOpen ? 0 : -1} // Only focusable when menu is open
                  >
                    <span className="flex items-center gap-3 bg-[rgba(var(--theme-rgb),0.1)] backdrop-blur-sm rounded-lg p-4 w-full text-center">
                      Settings
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </footer>
        </div>
      </aside>
    </>
  );
};

export default Aside;
