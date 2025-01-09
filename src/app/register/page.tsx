"use client";
import { useState, useEffect } from "react";
import { ArrowRight, Mail, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { createHash } from "crypto";
import { useRouter } from "next/navigation";
import Banner from "../components/Banner";
import { supabase } from "../utils/supabase";

const hashString = (data: string): string => {
  return createHash("sha256").update(data).digest("hex");
};

const Register = () => {
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (value: string, name: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError("Please accept the terms of service and privacy policy");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const hashedPassword = hashString(formData.password);
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: hashedPassword,
      });
      if (error) {
        throw error;
      }
      if (data?.user?.role === "authenticated") {
        router.push(
          `/confirm-email?email=${formData.email}&password=${hashedPassword}`
        );
      }
      return data;
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-radial from-theme/10 via-transparent to-background/5">
      <h1 className="absolute left-1/2 -translate-x-1/2 text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-r from-foreground to-theme drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] md:hidden">
        FRAME THE BEAT
      </h1>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90%,520px)] p-2 rounded-3xl border border-theme bg-gradient-to-br from-background/5 to-background backdrop-blur-lg shadow-lg shadow-theme transition-all duration-400 ease-out hover:shadow-xl hover:shadow-theme">
        <div className="text-center">
          <h2 className="text-theme text-3xl font-bold p-2">Create Account</h2>
          <p className="text-foreground/70 text-lg my-7">
            Join our community and discover amazing album covers
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
              className="w-full py-4 pl-12 pr-4 bg-background/5 border-2 border-theme/25 rounded-2xl text-foreground text-lg tracking-wide transition-all duration-300 ease-out focus:outline-none focus:border-theme/70 focus:shadow-[0_0_25px_rgba(var(--theme-rgb),0.2)] focus:-translate-y-0.5"
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
              className="w-full py-4 pl-12 pr-4 bg-background/5 border-2 border-theme/25 rounded-2xl text-foreground text-lg tracking-wide transition-all duration-300 ease-out focus:outline-none focus:border-theme/70 focus:shadow-[0_0_25px_rgba(var(--theme-rgb),0.2)] focus:-translate-y-0.5"
              value={formData.password}
              onChange={(e) => handleInputChange(e.target.value, "password")}
              required
            />
          </div>

          <div className="relative w-full">
            <ShieldCheck
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white transition-all duration-300 peer-focus:text-theme peer-focus:scale-110"
              size={20}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full py-4 pl-12 pr-4 bg-background/5 border-2 border-theme/25 rounded-2xl text-foreground text-lg tracking-wide transition-all duration-300 ease-out focus:outline-none focus:border-theme/70 focus:shadow-[0_0_25px_rgba(var(--theme-rgb),0.2)] focus:-translate-y-0.5"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange(e.target.value, "confirmPassword")
              }
              required
            />
          </div>

          <div className="flex gap-4 mt-3">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="w-5 h-5 mt-1 appearance-none border-2 border-theme/50 rounded cursor-pointer transition-all duration-300 checked:bg-theme checked:border-theme relative checked:after:content-['✔'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:scale-120 checked:after:text-background checked:after:text-sm"
            />
            <p className="text-foreground/70">
              By creating an account, you agree to our{" "}
              <Link
                href="/tp/terms-of-service"
                className="text-theme font-semibold hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/tp/privacy-policy"
                className="text-theme font-semibold hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-br from-theme to-theme/85 text-background text-lg font-semibold tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-theme/35 transition-all duration-400 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-theme/45 hover:from-theme hover:to-theme/90"
            >
              Create Account
              <ArrowRight
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>

          <p className="text-center text-foreground/70">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-theme font-semibold hover:underline ml-1"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>

      {error && (
        <Banner
          title={"Log in process failed"}
          subtitle={`${
            error.charAt(0).toUpperCase() + error.slice(1)
          }. Please try again later.`}
        />
      )}
    </main>
  );
};

export default Register;
