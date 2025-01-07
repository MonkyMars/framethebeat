"use client";
import { useState, useEffect } from "react";
import { ArrowRight, Mail, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
//";
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
      if(data?.user?.role === 'authenticated') {
        router.push(`/confirm-email?email=${formData.email}&password=${hashedPassword}`);
      };
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
    <main className="mainContent">
      <h1>FRAME THE BEAT</h1>
      <div className="section">
        <div className="header">
          <h2>Create Account</h2>
          <p>Join our community and discover amazing album covers</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <Mail size={20} />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange(e.target.value, "email")}
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
              onChange={(e) => handleInputChange(e.target.value, "password")}
              required
            />
          </div>
          <div className="inputGroup">
            <ShieldCheck size={20} />
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange(e.target.value, "confirmPassword")
              }
              required
            />
          </div>
          <div className="termsContainer">
            <input type="checkbox" checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)}/>
            <p className="terms">
              By creating an account, you agree to our{" "}
              <Link href="/tp/terms-of-service">Terms of Service</Link> and{" "}
              <Link href="/tp/privacy-policy">Privacy Policy</Link>
            </p>
          </div>
          <div className="ctaButtonContainer">
            <button type="submit">
              Create Account
              <ArrowRight size={20} />
            </button>
          </div>
          <p className="loginLink">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </form>
      </div>
      {error && <Banner title={"Log in process failed"} subtitle={`${error.charAt(0).toUpperCase() + error.slice(1)}. Please try again later.`} />}
    </main>
  );
};

export default Register;
