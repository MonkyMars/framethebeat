"use client";
import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import {
  Sun,
  Languages,
  User,
  Info,
  Mail,
  Lock,
  Eye,
  EyeClosed,
  X,
} from "lucide-react";
import { useAuth } from "../utils/AuthContext";
import { useRouter } from "next/navigation";
import { logOutUser, updateUser, deleteUser } from "../utils/database";
import Banner from "../components/Banner";
import Slider from "./Slider";
import { useTheme } from "next-themes";

const Settings = () => {
  const [gridSize, setGridSize] = useState("medium");
  const [defaultSort, setDefaultSort] = useState("newest");
  const [animations, setAnimations] = useState(true);
  const { session } = useAuth();
  const router = useRouter();
  const [response, setResponse] = useState<string | null>(null);
  const [validateValue, setValidateValue] = useState<string>("");
  const [validatePopup, setValidatePopup] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  
  useEffect(() => {
    if (response) {
      setTimeout(() => setResponse(null), 5000);
    }
  }, [response]);
  if (!mounted) return null;

  const onUpDateProfile = async () => {
    const response = await updateUser(formValues.email, formValues.password);
    if (response.error) {
      console.error(response.error);
      return;
    }
    setResponse("Profile updated successfully");
  };

  const onDeleteAccount = async () => {
    const user_id = session?.user.id;
    if (!user_id) return;
    const response = await deleteUser(user_id);
    const data = await response.json();
    if (data.message) {
      console.error(data.message);
    }
    setResponse("Account deleted successfully");
    router.push("/login");
  };

  const validateOnDeleteUser = () => {
    const email = session?.user.email;
    if (!email) return;
    if (validateValue === email) {
      onDeleteAccount();
      setValidatePopup(false);
    } else {
      setResponse("Values do not match");
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
    value: string
  ) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Nav />
      <main className="container mx-auto px-4 py-8 max-w-[1200px] min-h-[calc(100vh-70px)]">
        <header className="relative text-center py-16 mb-8">
          <div className="absolute inset-0" />

          <div className="relative space-y-6">
            <h1 className="inline-block text-2xl md:text-3xl font-black uppercase tracking-[0.15em]">
              Settings
            </h1>

            <div className="relative">
              <p className="text-base md:text-lg font-medium text-[rgba(var(--foreground-rgb),0.8)] max-w-md mx-auto">
                Customize your album browsing experience
              </p>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r from-[rgba(var(--theme-rgb),0.5)] to-[rgba(var(--theme-rgb),0.2)]" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
          <section className="bg-background/50 backdrop-blur-xl border border-theme rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-[0_8px_20px_rgba(var(--theme-rgb),0.2)] hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-8 text-theme">
              <Sun size={24} strokeWidth={1.5} />
              <h2 className="text-xl font-semibold">Appearance</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <label>Theme</label>
                <div className="flex gap-2">
                  {["light", "dark", "system"].map((t) => (
                    <button
                      key={t}
                      className={`px-4 py-2 rounded-md border border-theme bg-background/20 text-foreground hover:border-theme transition-all ${
                        theme === t
                          ? "bg-theme text-background border-theme"
                          : ""
                      }`}
                      onClick={() => setTheme(t)}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <Slider
                label="Animations"
                checked={animations}
                onChange={setAnimations}
              />
            </div>
          </section>

          <section className="bg-background/50 backdrop-blur-xl border border-theme rounded-xl p-8 shadow-lg transition-all duration-300 relative opacity-50 blur-sm pointer-events-none">
            <div className="flex items-center gap-4 mb-6 text-theme">
              <Languages size={24} />
              <h2 className="text-xl">Language & Region</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <label>Language</label>
                <select
                  className="px-4 py-2 rounded-md bg-background border border-theme text-foreground focus:outline-none focus:border-theme"
                  value={gridSize}
                  onChange={(e) => setGridSize(e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="spanish">Español</option>
                  <option value="french">Français</option>
                  <option value="german">Deutsch</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <label>Date Format</label>
                <select
                  className="px-4 py-2 rounded-md bg-background border border-theme text-foreground focus:outline-none focus:border-theme"
                  value={defaultSort}
                  onChange={(e) => setDefaultSort(e.target.value)}
                >
                  <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                  <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                  <option value="yyyy/mm/dd">YYYY/MM/DD</option>
                </select>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold uppercase tracking-wider text-foreground/90">
                Coming Soon
              </span>
            </div>
          </section>

          {session?.user && (
            <>
              <section className="bg-background/50 backdrop-blur-xl border border-theme rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-[0_8px_20px_rgba(var(--theme-rgb),0.2)] hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6 text-theme">
                  <User size={24} />
                  <h2 className="text-xl">Account</h2>
                </div>
                <div className="flex flex-col gap-4">
                  <button
                    className="w-full px-6 py-3 rounded-lg bg-red-500/10 border-2 border-red-500/20 text-red-500 font-medium transition-all duration-300 hover:bg-red-500/20"
                    onClick={async () => {
                      await logOutUser();
                      router.push("/login");
                    }}
                  >
                    Sign Out
                  </button>
                  <button
                    className="w-full px-6 py-3 rounded-lg bg-red-500/10 border-2 border-red-500/20 text-red-500 font-medium transition-all duration-300 hover:bg-red-500/20"
                    onClick={() => setValidatePopup(true)}
                  >
                    Delete Account
                  </button>
                </div>
              </section>

              <div className="bg-background/50 backdrop-blur-xl border border-theme rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-[0_8px_20px_rgba(var(--theme-rgb),0.2)] hover:-translate-y-1">
                <div className="flex flex-col gap-6">
                  <label className="font-medium text-theme/80 flex items-center gap-2">
                    <Mail size={24} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="px-4 py-3 rounded-lg border border-theme bg-background text-foreground focus:outline-none focus:border-theme/50 focus:shadow-[0_0_0_2px_rgba(var(--theme-rgb),0.1)]"
                    value={formValues.email}
                    onChange={(e) =>
                      handleFormChange(e, "email", e.target.value)
                    }
                  />
                  <label className="font-medium text-theme/80 flex items-center gap-2">
                    <Lock size={24} />
                    Password
                  </label>
                  <input
                    type={togglePassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    className="px-4 py-3 rounded-lg border border-theme bg-background text-foreground focus:outline-none focus:border-theme/50 focus:shadow-[0_0_0_2px_rgba(var(--theme-rgb),0.1)]"
                    value={formValues.password}
                    onChange={(e) =>
                      handleFormChange(e, "password", e.target.value)
                    }
                  />
                  {togglePassword ? (
                    <Eye
                      size={24}
                      className="absolute right-8 top-1/2 -translate-y-[50%] cursor-pointer text-theme/50"
                      onClick={() => setTogglePassword(false)}
                    />
                  ) : (
                    <EyeClosed
                      size={24}
                      className="absolute right-8 top-1/2 -translate-y-[50%] cursor-pointer text-theme/50"
                      onClick={() => setTogglePassword(true)}
                    />
                  )}
                  <button
                    className="w-full px-6 py-3 rounded-lg bg-theme-dark text-foreground font-medium transition-all duration-300 hover:bg-theme hover:shadow-lg hover:shadow-theme/30"
                    onClick={onUpDateProfile}
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </>
          )}

          <section className="bg-background/50 backdrop-blur-xl border border-theme rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-[0_8px_20px_rgba(var(--theme-rgb),0.2)] hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6 text-theme">
              <Info size={24} />
              <h2 className="text-xl">About</h2>
            </div>
            <div className="flex flex-col gap-4">
              <p>Version 1.0.0</p>
              <a className="text-theme hover:underline" href="#">
                Terms of Service
              </a>
              <a className="text-theme hover:underline" href="#">
                Privacy Policy
              </a>
            </div>
          </section>

          {/* Login Section - Only shown when logged out */}
          {!session?.user && (
            <section className="bg-background/50 backdrop-blur-xl border border-theme/20 rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-[0_8px_20px_rgba(var(--theme-rgb),0.2)] hover:-translate-y-1">
              <div className="flex flex-col gap-4">
                <header className="flex items-center gap-4 mb-6 text-theme">
                  <User size={24} />
                  <h2 className="text-xl">Log in</h2>
                </header>
                <p>Log in to get access to more features</p>
                <div className="border-none p-0 m-0">
                  <button
                    className="w-full px-6 py-3 rounded-lg bg-theme/90 text-foreground font-medium transition-all duration-300 hover:bg-theme hover:shadow-lg hover:shadow-theme/30"
                    onClick={() => router.push("/login")}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Validation Popup */}
      {validatePopup && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] bg-background border border-theme/20 rounded-xl p-8 shadow-2xl">
            <header className="mb-6">
              <h3 className="text-red-600 text-xl text-center">
                Confirm account deletion
              </h3>
            </header>
            <main className="flex flex-col gap-4">
              <p className="text-center">
                Are you sure you want to delete your account?
              </p>
              <label className="text-center">
                To confirm, type &apos;&apos;
                <b className="text-theme/90">{session?.user.email}</b>
                &apos;&apos; in the box below
              </label>
              <input
                type="text"
                className="px-4 py-3 rounded-lg border border-theme/20 bg-background/5 text-foreground focus:outline-none focus:border-theme/50 focus:shadow-[0_0_0_2px_rgba(var(--theme-rgb),0.1)]"
                value={validateValue}
                onChange={(e) => setValidateValue(e.target.value)}
              />
              <button
                className="px-4 py-3 rounded-lg border-2 bg-red-600/20 border-red-600/60 text-white transition-all duration-200 hover:bg-red-600/30"
                onClick={() => validateOnDeleteUser()}
              >
                Delete account
              </button>
              <button
                className="px-4 py-3 rounded-lg border-2 bg-theme/10 text-theme border-theme/60 transition-all duration-200 hover:bg-theme/20"
                onClick={() => setValidatePopup(false)}
              >
                Cancel deletion
              </button>
            </main>
            <X
              size={24}
              onClick={() => setValidatePopup(false)}
              className="absolute top-4 right-4 cursor-pointer text-theme/60 rounded-full transition-all duration-200 hover:text-theme/90 hover:bg-theme/10 hover:scale-[1.1]"
            />
          </div>
        </div>
      )}

      {response && <Banner title={response} subtitle={response} />}
      <Footer />
    </>
  );
};

export default Settings;
