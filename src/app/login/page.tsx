"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Mail, Lock } from "lucide-react";
import Link from "next/link";
import "./styles.scss";
import { logInUser } from "../utils/database";
import { useRouter } from "next/navigation";
import { createHash } from "crypto";
import Banner from "../components/Banner";
import { supabase } from "../utils/supabase";

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
      
      if (response.status === 200 && response.data) {
        await supabase.auth.setSession(response.data);
        router.push("/saved");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error as string);
    }
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
    <main className="mainContent">
      <h1>FRAME THE BEAT</h1>
      <div className="section">
        <div className="header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue exploring album covers</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <Mail size={20} />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              name="email"
              autoComplete="email"
            />
          </div>
          <div className="inputGroup">
            <Lock size={20} />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              name="password"
              autoComplete="current-password"
            />
          </div>
          <div className="checkboxContainer">
            <Link href="/forgot-password">Forgot Password?</Link>
          </div>
          <div className="ctaButtonContainer">
            <button type="submit">
              Sign In
              <ArrowRight size={20} />
            </button>
          </div>
          <p className="registerLink">
            Don&apos;t have an account? <Link href="/register">Register</Link>
          </p>
        </form>
      </div>
      {error && <Banner title={"Log in failed"} subtitle={error} />}
    </main>
  );
};

export default Login;
