import React from "react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import "../styles.scss"
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <>
      <Nav/>
      <main className="mainContainer">
        <div className="privacy-content">
          <h1>Privacy Policy</h1>
          
          <h2>1. Introduction</h2>
          <p>This Privacy Policy explains how Frame The Beat (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, and protects your personal information when you use our website.</p>

          <h2>2. Data Collection</h2>
          <p>We collect information that you provide directly to us and data automatically collected when you use our website:</p>
          <ul>
            <li>Usage data (through Vercel Analytics)</li>
            <li>Device information</li>
            <li>IP address</li>
          </ul>

          <h2>3. Data Usage</h2>
          <p>We use your data to:</p>
          <ul>
            <li>Improve our website performance</li>
            <li>Analyze user behavior and preferences</li>
            <li>Maintain website security</li>
          </ul>

          <h2>4. Third-Party Sharing</h2>
          <p>We use Vercel Analytics for website analytics. No personal data is shared with other third parties unless required by law.</p>

          <h2>5. Cookies</h2>
          <p>We use essential cookies to ensure proper website functionality. Analytics cookies are used through Vercel Analytics.</p>

          <h2>6. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal data.</p>

          <h2>7. Your Rights (GDPR)</h2>
          <p>Under GDPR, you have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Rectify inaccurate data</li>
            <li>Request data erasure</li>
            <li>Restrict processing</li>
            <li>Data portability</li>
          </ul>

          <h2>8. Policy Updates</h2>
          <p>We may update this policy occasionally. Significant changes will be notified via website announcement.</p>

          <h2>9. Contact Us</h2>
          <p>For privacy-related inquiries, contact us at: <Link href="mailto:support@framethebeat.com">support@framethebeat.com</Link></p>
        </div>
      </main>
      <Footer/>
    </>
  )
}

export default PrivacyPolicy;