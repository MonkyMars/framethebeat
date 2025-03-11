"use client";
import React, { useEffect, useState, Suspense, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { useSearchParams } from "next/navigation";
import { Settings, Home } from "lucide-react";

const ConfirmEmail = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [mounted, setMounted] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") ?? null;

  useEffect(() => {
    setMounted(true);
    setLoading(true);
    const interval = setInterval(async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          setError(error.message);
          clearInterval(interval);
          return;
        }
        setLoading(false);
        if (!session) return;
        if (session.user?.email && session.user.user_metadata.email_verified) {
          setVerified(true);
          clearInterval(interval);
        }
      } catch (unexpectedError) {
        setError(
          "An unexpected error occurred. Please refresh the page or try again later."
        );
        console.error("Unexpected error:", unexpectedError);
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const onContinue = async () => {
    if (!email) return;
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: pin.join(""),
      type: "email",
    });

    if (error) {
      console.error("Sign in error:", error);
      setError(error.message);
      return;
    }
    if (data?.user?.role === "authenticated") {
      setVerified(true);
    }
  };

  const handleInputChange = (value: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    
    if (value && index < pin.length - 1 && mounted) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const onResend = async () => {
    if (!email) return;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (error) {
      console.error("Resend verification email error:", error);
      setError(error.message);
      return;
    }
    setError("Verification email resent successfully.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center p-8" aria-label="Email verification page">
          <div role="status">
            <section className="w-[clamp(300px,90vw,500px)] text-center p-10 rounded-xl bg-[rgba(var(--theme-rgb),0.1)] backdrop-blur-[15px] border border-[rgba(var(--theme-rgb),0.2)] shadow-[0_10px_30px_rgba(0,0,0,0.2)] animate-fadeIn">
              <h1 className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] mb-6 bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)] bg-clip-text text-transparent">
                Verifying your email...
              </h1>
              <p className="text-[clamp(1rem,2.5vw,1.2rem)] text-[var(--foreground)] leading-relaxed mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
                Please wait while we confirm your registration.
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center p-8" aria-label="Email verification error">
          <div role="alert">
            <section className="w-[clamp(300px,90vw,500px)] text-center p-10 rounded-xl bg-[rgba(var(--theme-rgb),0.1)] backdrop-blur-[15px] border border-[rgba(var(--theme-rgb),0.2)] shadow-[0_10px_30px_rgba(0,0,0,0.2)] animate-fadeIn">
              <h1 className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] mb-6 bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)] bg-clip-text text-transparent shadow-[0_0_15px_rgba(255,255,255,0.6)]">
                Verification Error
              </h1>
              <p className="text-[clamp(1rem,2.5vw,1.2rem)] text-[var(--foreground)] leading-relaxed mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
                {error}
              </p>
              <button
                className="flex items-center gap-1.5 py-3 px-8 text-lg font-medium text-[var(--background)] bg-[var(--theme)] rounded-lg border-none cursor-pointer transition-all duration-300 ease-in-out hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(var(--theme-rgb),0.3)] active:translate-y-0 disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--theme-rgb),0.5)]"
                onClick={onResend}
              >
                Resend verification email
              </button>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center p-8" aria-label="Awaiting email verification">
          <div role="alert">
            <section className="w-[clamp(300px,90vw,500px)] text-center p-10 rounded-xl bg-[rgba(var(--theme-rgb),0.1)] backdrop-blur-[15px] border border-[rgba(var(--theme-rgb),0.2)] shadow-[0_10px_30px_rgba(0,0,0,0.2)] animate-fadeIn">
              <h1 className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] mb-6 bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)] bg-clip-text text-transparent">
                Awaiting Email Verification
              </h1>
              <p className="text-[clamp(1rem,2.5vw,1.2rem)] text-[var(--foreground)] leading-relaxed mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
                Please check <b className="text-[rgba(var(--theme-rgb),0.9)]">{email}</b> for a verification pin. Once verified, this page will update automatically.
              </p>
              <div className="flex justify-center gap-4 my-8">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(e.target.value, index)}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Backspace" ||
                        e.key === "ArrowLeft" ||
                        e.key === "ArrowRight" ||
                        e.key === "Tab" ||
                        e.key === "Delete"
                      ) {
                        return;
                      }
                      if (!/^[0-9]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-12 h-12 text-center text-2xl border-2 border-[rgba(var(--theme-rgb),0.25)] rounded-lg bg-[rgba(var(--background-rgb),0.1)] text-[var(--foreground)] transition-all duration-300 ease-in-out focus:outline-none focus:border-[rgba(var(--theme-rgb),0.5)] focus:shadow-[0_0_0_2px_rgba(var(--theme-rgb),0.1)] focus:translate-y-[-2px] placeholder-[rgba(var(--foreground-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--theme-rgb),0.5)]"
                  />
                ))}
              </div>
              <button
                className="flex items-center gap-1.5 py-3 px-8 text-lg font-medium text-[var(--background)] bg-[var(--theme)] rounded-lg border-none cursor-pointer transition-all duration-300 ease-in-out hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(var(--theme-rgb),0.3)] active:translate-y-0 disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--theme-rgb),0.5)]"
                onClick={onContinue}
                disabled={pin.every((value) => value !== "") ? false : true}
              >
                Continue
              </button>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 flex items-center justify-center p-8" aria-label="Email verification success">
        <div>
          <section className="w-[clamp(300px,90vw,500px)] text-center p-10 rounded-xl bg-[rgba(var(--theme-rgb),0.1)] backdrop-blur-[15px] border border-[rgba(var(--theme-rgb),0.2)] shadow-[0_10px_30px_rgba(0,0,0,0.2)] animate-fadeIn">
            <h1 className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] mb-6 bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)] bg-clip-text text-transparent shadow-[0_0_15px_rgba(255,255,255,0.6)]">
              Email Verified Successfully
            </h1>
            <p className="text-[clamp(1rem,2.5vw,1.2rem)] text-[var(--foreground)] leading-relaxed mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
              Your email has been verified. You can now access all features.
            </p>
            <h3 className="text-[clamp(1.1rem,2.75vw,1.3rem)] text-[var(--foreground)] leading-relaxed mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
              Continue to:
            </h3>
            <div className="flex justify-center gap-4 items-center">
              <button
                className="flex items-center gap-1.5 py-3 px-8 text-lg font-medium text-[var(--background)] bg-[var(--theme)] rounded-lg border-none cursor-pointer transition-all duration-300 ease-in-out hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(var(--theme-rgb),0.3)] active:translate-y-0 disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--theme-rgb),0.5)]"
                onClick={() => router.push("/")}
              >
                <Home size={24} />
                Home
              </button>
              <button
                className="flex items-center gap-1.5 py-3 px-8 text-lg font-medium text-[var(--background)] bg-[var(--theme)] rounded-lg border-none cursor-pointer transition-all duration-300 ease-in-out hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(var(--theme-rgb),0.3)] active:translate-y-0 disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--theme-rgb),0.5)]"
                onClick={() => router.push("/settings")}
              >
                <Settings size={24} />
                Settings
              </button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const ConfirmEmailPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmEmail />
    </Suspense>
  );
};

export default ConfirmEmailPage;
