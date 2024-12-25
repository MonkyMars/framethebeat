"use client";
import { useState } from "react";
import { ArrowRight, UserPlus, Mail, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import "./styles.scss";
import { signupUser } from "../utils/database";
import { createHash } from "crypto";
import { useRouter } from "next/navigation";

const hashString = (data: string): string => {
  return createHash("sha256").update(data).digest("hex");
};

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = debounce((value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, 30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await signupUser(
      formData.email,
      hashString(formData.password)
    );
    if (response.status === 200) {
      router.push("/");
    }
  };

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
            <UserPlus size={20} />
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => handleInputChange(e.target.value, "username")}
              required
              name="username"
              autoComplete="username"
            />
          </div>
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
    </main>
  );
};

const debounce = <T extends (...args: string[]) => void>(
  func: T,
  delay: number
) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): void => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default Register;
