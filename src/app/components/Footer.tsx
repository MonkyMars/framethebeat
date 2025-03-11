import Link from "next/link";
import '../globals.css'

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center gap-6 py-8 px-4 bg-[rgba(var(--background-rgb),0.05)] border-t border-[rgba(var(--theme-rgb),0.3)]" role="contentinfo" aria-label="Site footer">
      <p className="text-[rgba(var(--foreground-rgb),0.7)]">
        &copy; 2024 Frame The Beat. All rights reserved.
      </p>
      <nav aria-label="Footer navigation">
        <ul className="flex flex-wrap gap-6" role="list">
          <li>
            <Link 
              href="/tp/privacy-policy" 
              className="text-[rgba(var(--foreground-rgb),0.7)] hover:text-theme transition-all duration-400 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-theme focus:ring-offset-2 rounded-md p-1"
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link 
              href="/tp/terms-of-service" 
              className="text-[rgba(var(--foreground-rgb),0.7)] hover:text-theme transition-all duration-400 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-theme focus:ring-offset-2 rounded-md p-1"
              aria-label="Terms of Service"
            >
              Terms of Service
            </Link>
          </li>
          <li>
            <Link 
              href="https://github.com/MonkyMars/framethebeat/tree/master" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[rgba(var(--foreground-rgb),0.7)] hover:text-theme transition-all duration-400 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-theme focus:ring-offset-2 rounded-md p-1"
              aria-label="View source code on GitHub (opens in a new tab)"
            >
              Source code
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;