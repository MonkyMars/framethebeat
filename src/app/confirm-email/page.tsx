"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import "./styles.scss";
// import { useAuth } from "../utils/AuthContext";

const ConfirmEmailPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setLoading(false);

    const interval = setInterval(async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        console.log("session", session, error);

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
              <button onClick={() => router.push("/")}>Return to Home</button>
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
                Please check your email for a verification link. Once verified,
                this page will update automatically.
              </p>
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
            <button onClick={() => router.push("/settings")}>
              Continue to Settings
            </button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConfirmEmailPage;
