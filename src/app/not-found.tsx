import React from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const NotFound = () => {
  return (
    <>
      <Nav />
      <main className="min-h-screen flex justify-center items-center text-center p-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-theme/30 to-theme/10 bg-clip-text text-transparent shadow-[0_2px_10px_rgba(var(--theme-rgb),0.2)]">
            404
          </h1>
          <p className="text-2xl font-semibold text-foreground mb-8 hover:shadow-[0_4px_15px_rgba(var(--theme-rgb),0.3)]">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <p className="text-lg leading-relaxed text-foreground mb-10 p-4 rounded-lg bg-gradient-to-br from-theme/5 to-theme/10 backdrop-blur-md border border-theme/20 shadow-[0_1px_3px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(var(--theme-rgb),0.15)] transition-all duration-300">
            It seems you&apos;ve hit a broken link or the page has been removed.
            Use the button below to navigate back to safety.
          </p>
          <button className="inline-block px-8 py-3 text-lg font-medium text-background bg-theme rounded-lg border-2 border-transparent transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(var(--theme-rgb),0.3)] active:translate-y-0">
            Go to Homepage
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;