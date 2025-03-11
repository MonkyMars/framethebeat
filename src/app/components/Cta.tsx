"use client";
import '../globals.css'
import { useAuth } from "../utils/AuthContext";
import { useRouter } from "next/navigation";


const Cta = () => {
  const { session } = useAuth();
  const router = useRouter();

  return !session ? (
    <section className="section" aria-labelledby="join-heading">
      <h2 id="join-heading">
        Join the Community
      </h2>
      <p>
        Sign up now to save your favorite album covers and contribute your own!
      </p>
      <div className="flex justify-center gap-4 w-full" role="group" aria-label="Authentication options">
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 rounded-lg bg-gradient-to-br from-theme to-theme/80 text-foreground text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-theme/30 focus:outline-none focus:ring-2 focus:ring-theme focus:ring-offset-2"
          aria-label="Log in to your account"
        >
          Log In
        </button>
        <button
          onClick={() => router.push("/register")}
          className="px-6 py-3 rounded-lg bg-gradient-to-br from-theme to-theme/80 text-foreground text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-theme/30 focus:outline-none focus:ring-2 focus:ring-theme focus:ring-offset-2"
          aria-label="Create a new account"
        >
          Sign Up
        </button>
      </div>
    </section>
  ) : (
    <section className="section" aria-labelledby="welcome-heading">
      <h2 id="welcome-heading">
        Welcome!
      </h2>
      <p>
        Welcome to Frame The Beat! Save your favorite album covers and share them with the world.
      </p>
      <div className="flex justify-center gap-4 w-full" role="group" aria-label="User options">
        <button
          onClick={() => router.push("/settings")}
          className="px-6 py-3 rounded-lg bg-gradient-to-br from-theme to-theme/80 text-foreground text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-theme/30 focus:outline-none focus:ring-2 focus:ring-theme focus:ring-offset-2"
          aria-label="Go to account settings"
        >
          Settings
        </button>
        <button
          onClick={() => router.push("/saved")}
          className="px-6 py-3 rounded-lg bg-gradient-to-br from-theme to-theme/80 text-foreground text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-theme/30 focus:outline-none focus:ring-2 focus:ring-theme focus:ring-offset-2"
          aria-label="View your saved album covers"
        >
          Saved album covers
        </button>
      </div>
    </section>
  );
};

export default Cta;