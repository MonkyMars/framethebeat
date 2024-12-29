"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import "./styles.scss";
import { useSearchParams } from "next/navigation";
import { Settings, Home } from "lucide-react";
const ConfirmEmail = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    setLoading(false);
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
    if(data?.user?.role === 'authenticated') {
      setVerified(true);
    }
  };

  const handleInputChange = (value: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < pin.length - 1) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const onResend = async () => {
    if (!email) return;
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) {
      console.error("Resend verification email error:", error);
      setError(error.message);
      return;
    }
    setError("Verification email resent successfully.");
  }

  if (loading) {
    return (
      <div className="confirm-email">
        <main aria-label="Email verification page">
          <div role="status">
            <section>
              <h1>Verifying your email...</h1>
              <p>Please wait while we confirm your registration.</p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="confirm-email">
        <main aria-label="Email verification error" className="confirm-email">
          <div role="alert">
            <section>
              <h1>Verification Error</h1>
              <p>{error}</p>
              <button onClick={onResend}>Resend verification email</button>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="confirm-email">
        <main aria-label="Awaiting email verification">
          <div role="alert">
            <section>
              <h1>Awaiting Email Verification</h1>
              <p>
                Please check <b>{email}</b> for a verification pin. Once verified,
                this page will update automatically.
              </p>
              <div className="pin-inputs">
                {pin.map((value, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    className="pin-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    placeholder={(index + 1).toString()}
                    value={value}
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
                  />
                ))}
              </div>
              <button onClick={onContinue} disabled={pin.every((value) => value !== "") ? false : true}>Continue</button>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="confirm-email">
      <Nav />
      <main aria-label="Email verification success">
        <div>
          <section>
            <h1>Email Verified Successfully</h1>
            <p>
              Your email has been verified. You can now access all features.
            </p>
            <h3>Continue to:</h3>
            <div className="buttonContainer">
              <button onClick={() => router.push("/")}>
                <Home size={24} />
                Home
              </button>
              <button onClick={() => router.push("/settings")}>
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
