"use client";
import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import "./styles.scss";
import { Sun, Languages, User, Info, Mail, Lock, Eye, EyeClosed } from "lucide-react";
import { useAuth } from "../utils/AuthContext";
import { useRouter } from "next/navigation";
import { updateUser } from "../utils/database";
import Banner from "../components/Banner";
const THEME_STORAGE_KEY = "album-covers-theme";

type Theme = "light" | "dark" | "system";

const Settings = () => {
  const [theme, setTheme] = useState<Theme>("system");
  const [gridSize, setGridSize] = useState("medium");
  const [defaultSort, setDefaultSort] = useState("newest");
  const [animations, setAnimations] = useState(true);
  const { session } = useAuth();
  const router = useRouter();
  const [response, setResponse] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<{email: string; password: string}>({
    email: "",
    password: "",
  });
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === "system") {
      root.removeAttribute("data-theme");
      return;
    }

    if (newTheme === "light") {
      root.style.setProperty("--background", "#e3e3e3");
      root.style.setProperty("--foreground", "#171717");
      root.style.setProperty("--theme", "#2398f7");
      root.style.setProperty("--theme-rgb", "35, 152, 247");
    } else {
      root.style.setProperty("--background", "#0a0a0a");
      root.style.setProperty("--background-rgb", "10,10,10");
      root.style.setProperty("--foreground", "#ededed");
      root.style.setProperty("--foreground-rgb", "237,237,237");
      root.style.setProperty("--theme", "#d17e3b");
      root.style.setProperty("--theme-rgb", "209,126,59");
    }

    root.setAttribute("data-theme", newTheme);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      setTheme(savedTheme as Theme);
      applyTheme(savedTheme as Theme);
    }
    setFormValues((prev) => ({ ...prev, email: session?.user?.email || "" }));

  }, [session]);

  const onUpDateProfile = async() => {
    const response = await updateUser(formValues.email, formValues.password);
    if (response.error) {
      console.error(response.error);
      return;
    }
    setResponse("Profile updated successfully");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>, name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    if (response) {
      setTimeout(() => {
        setResponse(null);
      }, 5000);
    }
  }, [response]);

  return (
    <>
      <Nav />
      <div className="settingsContainer">
        <header className="settingsHeader">
          <h1>Settings</h1>
          <p>Customize your album browsing experience</p>
        </header>

        <div className="settingsGrid">
          <section className="settingsCard">
            <div className="cardHeader">
              <Sun size={24} />
              <h2>Appearance</h2>
            </div>
            <div className="settingsContent">
              <div className="settingItem">
                <label>Theme</label>
                <div className="themeButtons">
                  {["light", "dark", "system"].map((t) => (
                    <button
                      key={t}
                      className={theme === t ? "active" : ""}
                      onClick={() => handleThemeChange(t as Theme)}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="settingItem">
                <label>Animations</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={animations}
                    onChange={(e) => setAnimations(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </section>

          <section className="settingsCard comingsoon">
            <div className="cardHeader">
              <Languages size={24} />
              <h2>Language & Region</h2>
            </div>
            <div className="settingsContent">
              <div className="settingItem">
                <label>Language</label>
                <select
                  value={gridSize}
                  onChange={(e) => setGridSize(e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="spanish">Español</option>
                  <option value="french">Français</option>
                  <option value="german">Deutsch</option>
                </select>
              </div>
              <div className="settingItem">
                <label>Date Format</label>
                <select
                  value={defaultSort}
                  onChange={(e) => setDefaultSort(e.target.value)}
                >
                  <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                  <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                  <option value="yyyy/mm/dd">YYYY/MM/DD</option>
                </select>
              </div>
            </div>
          </section>

          {session?.user && (
            <>
              <section className="settingsCard">
                <div className="cardHeader">
                  <User size={24} />
                  <h2>Account</h2>
                </div>
                <div className="settingsContent">
                  <button className="dangerButton">Sign Out</button>
                  <button className="dangerButton">Delete Account</button>
                </div>
              </section>

              <div className="formGroup">
                <label><Mail size={24}/>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="settingsInput"
                  value={formValues.email}
                  name="email"
                  onChange={(e) => handleFormChange(e, "email", e.target.value)}
                />
                <label><Lock size={24} />Password</label>
                <input
                  type={togglePassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className="settingsInput"
                  value={formValues.password}
                  name="password"
                  onChange={(e) => handleFormChange(e, "password", e.target.value)}
                />
                {togglePassword ? <Eye size={24} className="togglePassword" onClick={() => setTogglePassword(false)}/> : <EyeClosed size={24} className="togglePassword" onClick={() => setTogglePassword(true)}/>}
                <button className="primaryButton" onClick={onUpDateProfile}>
                  Update Profile
                </button>
              </div>
            </>
          )}

          <section className="settingsCard">
            <div className="cardHeader">
              <Info size={24} />
              <h2>About</h2>
            </div>
            <div className="settingsContent">
              <p>Version 1.0.0</p>
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
            </div>
          </section>
          {!session?.user && (
            <section className="settingsCard">
              <div className="settingsContent">
                <header className="cardHeader">
                  <User size={24} /> <h2>Log in</h2>
                </header>
                <p>Log in to get access to more features</p>
                <div className="formGroup null">
                  <button className="primaryButton" onClick={() => router.push('/login')}>Sign In</button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
      {response && <Banner title={"Updated user"} subtitle={response} />}
      <Footer />
    </>
  );
};

export default Settings;
