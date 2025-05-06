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
import Nav from "../components/Nav";
import Footer from "../components/Footer";

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
      }, 5000);
    }
  }, [error]);

  return (
    <>
      <Nav />
      <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-70px)]">
        <div className="max-w-xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[0.15em] mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-theme">
                Welcome Back
              </span>
            </h1>
            <div className="relative">
              <p className="text-base md:text-lg font-medium text-[rgba(var(--foreground-rgb),0.8)] max-w-md mx-auto">
                Log in to access your saved album covers and collections
              </p>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r from-[rgba(var(--theme-rgb),0.5)] to-[rgba(var(--theme-rgb),0.2)]" />
            </div>
          </header>

          <section className="section backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] p-8 transition-all duration-300 shadow-lg">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 w-full max-w-md mx-auto"
            >
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(var(--foreground-rgb),0.5)] transition-all duration-300"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-4 pl-12 bg-[rgba(var(--background-rgb),0.45)] border-2 border-[rgba(var(--theme-rgb),0.2)] rounded-xl text-foreground text-lg transition-all duration-300 focus:outline-none focus:border-[rgba(var(--theme-rgb),0.7)] focus:shadow-[0_0_20px_rgba(var(--theme-rgb),0.25)] focus:translate-y-[-3px] placeholder:text-[rgba(var(--foreground-rgb),0.45)]"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e.target.value, "email")}
                  required
                  name="email"
                  autoComplete="email"
                />
              </div>

              <div className="relative w-full">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(var(--foreground-rgb),0.5)] transition-all duration-300"
                  size={20}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-4 pl-12 bg-[rgba(var(--background-rgb),0.45)] border-2 border-[rgba(var(--theme-rgb),0.2)] rounded-xl text-foreground text-lg transition-all duration-300 focus:outline-none focus:border-[rgba(var(--theme-rgb),0.7)] focus:shadow-[0_0_20px_rgba(var(--theme-rgb),0.25)] focus:translate-y-[-3px] placeholder:text-[rgba(var(--foreground-rgb),0.45)]"
                  value={formData.password}
                  onChange={(e) => handleInputChange(e.target.value, "password")}
                  required
                />
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-br from-theme to-[rgba(var(--theme-rgb),0.8)] text-background text-lg font-semibold tracking-wider flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-[0_5px_15px_rgba(var(--theme-rgb),0.4)] hover:translate-y-[-2px]"
                >
                  Continue
                  <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              <div className="flex justify-between items-center mt-4">
                <Link
                  href="/register"
                  className="text-[rgba(var(--foreground-rgb),0.7)] hover:text-theme transition-all duration-300 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-theme focus:ring-offset-2 rounded-md p-1"
                >
                  Create an account
                </Link>
                
                <Link
                  href="#"
                  className="text-[rgba(var(--foreground-rgb),0.7)] hover:text-theme transition-all duration-300 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-theme focus:ring-offset-2 rounded-md p-1"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </section>
        </div>
      </main>
      <Footer />
      {error && (
        <Banner
          title={"Login failed"}
          subtitle={`${capitalizeFirstLetter(error)}. Please try again.`}
        />
      )}
    </>
  );
};

export default Login;