"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { logInUser } from "../utils/database";
import { useRouter } from "next/navigation";
import { createHash } from "crypto";
import Banner from "../components/Banner";
import { supabase } from "../utils/supabase";
import { capitalizeFirstLetter } from "../utils/functions";

const hashString = (data: string): string => {
  return createHash("sha256").update(data).digest("hex");
};

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await logInUser(
        formData.email, 
        hashString(formData.password)
      );
      
      const responseData = await response.json();
      if (response.status === 200 && responseData.session) {
        await supabase.auth.setSession(responseData.session);
        router.push("/");
      } else {
        setError(responseData.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error as string);
    }
  };

  const handleInputChange = (value: string, name: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000
      );
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-radial from-theme-dark via-transparent to-background/5">
    <h1 className="absolute left-1/2 -translate-x-1/2 text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-r from-foreground to-theme drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] md:hidden">
      FRAME THE BEAT
    </h1>

    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90%,520px)] p-2 rounded-3xl border border-theme bg-gradient-to-br from-background/5 to-background backdrop-blur-lg shadow-lg shadow-theme transition-all duration-400 ease-out hover:shadow-xl hover:shadow-theme">
      <div className="text-center">
        <h2 className="text-theme text-3xl font-bold p-2">Log In</h2>
        <p className="text-foreground/70 text-lg my-7">
          Welcome back!
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-full max-w-[440px] mx-auto"
      >
        <div className="relative w-full">
          <Mail
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white transition-all duration-300 peer-focus:text-theme peer-focus:scale-110"
            size={20}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full py-4 pl-12 pr-4 bg-transparent border-2 border-theme-dark rounded-2xl text-foreground text-lg tracking-wide transition-all duration-300 ease-out focus:outline-none focus:border-theme-dark focus:shadow-[0_0_25px_rgba(var(--theme-rgb),0.2)] focus:-translate-y-0.5"
            value={formData.email}
            onChange={(e) => handleInputChange(e.target.value, "email")}
            required
            name="email"
            autoComplete="email"
          />
        </div>

        <div className="relative w-full">
          <Lock
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white transition-all duration-300 peer-focus:text-theme peer-focus:scale-110"
            size={20}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full py-4 pl-12 pr-4 bg-transparent border-2 border-theme-dark rounded-2xl text-foreground text-lg tracking-wide transition-all duration-300 ease-out focus:outline-none focus:border-theme/70 focus:shadow-[0_0_25px_rgba(var(--theme-rgb),0.2)] focus:-translate-y-0.5"
            value={formData.password}
            onChange={(e) => handleInputChange(e.target.value, "password")}
            required
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-br from-theme to-theme/85 text-foreground text-lg font-semibold tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-theme/35 transition-all duration-400 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-theme/45 hover:from-theme hover:to-theme/90"
          >
            Continue
            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>

        <p className="text-center text-foreground/70">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-theme font-semibold hover:underline ml-1"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>

    {error && (
      <Banner
        title={"Log in process failed"}
        subtitle={`${
          capitalizeFirstLetter(error)
        }. Please try again later.`}
      />
    )}
  </main>
  );
};

export default Login;
