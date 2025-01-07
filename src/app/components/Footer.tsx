import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center gap-6 py-8 px-4 bg-[rgba(var(--background-rgb),0.05)] border-t border-[rgba(var(--theme-rgb),0.3)]">
      <p className="text-[rgba(var(--foreground-rgb),0.7)]">
        &copy; 2024 Frame The Beat. All rights reserved.
      </p>
      <ul className="flex flex-wrap gap-6">
        <li>
          <Link 
            href="/tp/privacy-policy" 
            className="text-[rgba(var(--foreground-rgb),0.7)] hover:text-theme transition-all duration-400 hover:translate-y-[-2px]"
          >
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link 
            href="/tp/terms-of-service" 
            className="text-[rgba(var(--foreground-rgb),0.7)] hover:text-theme transition-all duration-400 hover:translate-y-[-2px]"
          >
            Terms of Service
          </Link>
        </li>
        <li>
          <Link 
            href="https://github.com/MonkyMars/framethebeat/tree/master" 
            target="_blank"
            className="text-[rgba(var(--foreground-rgb),0.7)] hover:text-theme transition-all duration-400 hover:translate-y-[-2px]"
          >
            Source code
          </Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;