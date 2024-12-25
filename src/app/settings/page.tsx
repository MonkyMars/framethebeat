"use client";
import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import "./styles.scss";
import { Sun, Languages, User, Info } from "lucide-react";

const THEME_STORAGE_KEY = "album-covers-theme";

type Theme = "light" | "dark" | "system";

const Settings = () => {
  const [theme, setTheme] = useState<Theme>("system");
  const [gridSize, setGridSize] = useState("medium");
  const [defaultSort, setDefaultSort] = useState("newest");
  const [animations, setAnimations] = useState(true);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === "system") {
      root.removeAttribute("data-theme");
      return;
    }

    if (newTheme === "light") {
      root.style.setProperty("--background", "#ffffff");
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
  }, []);

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
          <div className="formGroup">
            <label>Display Name</label>
            <input
              type="text"
              placeholder="Enter your display name"
              className="settingsInput"
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="settingsInput"
            />

            <button className="primaryButton">Update Profile</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
