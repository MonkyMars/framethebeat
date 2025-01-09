import React from "react"
import Nav from "../../components/Nav"
import Footer from "../../components/Footer"
import Link from "next/link"

const PrivacyPolicy = () => {
  return (
    <>
      <Nav/>
      <main className="max-w-[1200px] mx-auto p-8 min-h-[calc(100vh-70px)]">
        <div className="my-8 mx-auto max-w-[900px]">
          <h1
            className="text-2xl md:text-4xl font-extrabold uppercase mb-8"
            style={{ textShadow: "0 0 15px rgba(255,255,255,0.6),0 0 25px rgba(255,255,255,0.4),0 0 35px rgba(var(--theme-rgb),0.3)" }}
          >
            Privacy Policy
          </h1>
          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">1. Introduction</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
            This Privacy Policy explains how Frame The Beat (&ldquo;we&rdquo;,&ldquo;us&rdquo;,&ldquo;our&rdquo;) collects, uses, and protects your personal information when you use our website.
          </p>
          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">2. Data Collection</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
            We collect information that you provide directly to us and data automatically collected when you use our website:
          </p>
          <ul className="ml-5 mb-4">
            <li className="relative pl-5 mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">Usage data (through Vercel Analytics)</li>
            <li className="relative pl-5 mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">Device information</li>
            <li className="relative pl-5 mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">IP address</li>
          </ul>
          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">3. Data Usage</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">We use your data to:</p>
          <ul className="ml-5 mb-4">
            <li className="relative pl-5 mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">Improve our website performance</li>
            <li className="relative pl-5 mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">Analyze user behavior and preferences</li>
            <li className="relative pl-5 mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">Maintain website security</li>
          </ul>
          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">4. Third-Party Sharing</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
            We use Vercel Analytics for website analytics. No personal data is shared with other third parties unless required by law.
          </p>
          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">5. Cookies</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
            We use essential cookies to ensure proper website functionality. Analytics cookies are used through Vercel Analytics.
          </p>
          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">6. Data Security</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
            We implement appropriate technical and organizational measures to protect your personal data.
          </p>
          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">7. Your Rights (GDPR)</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
            Under GDPR, you have the right to:
          </p>
          <ul className="ml-5 mb-4">
            <li className="relative pl-5 mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">Access your personal data</li>
            <li className="relative pl-5 mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">Rectify inaccurate data</li>
            <li className="relative pl-5 mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">Request data erasure</li>
            <li className="relative pl-5 mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">Restrict processing</li>
            <li className="relative pl-5 mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">Data portability</li>
          </ul>
          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">8. Policy Updates</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
            We may update this policy occasionally. Significant changes will be notified via website announcement.
          </p>
          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">9. Contact Us</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
            For privacy-related inquiries, contact us at:&nbsp;
            <Link href="mailto:support@framethebeat.com" className="text-[color:var(--theme)] hover:underline hover:opacity-80">
              support@framethebeat.com
            </Link>
          </p>
        </div>
      </main>
      <Footer/>
    </>
  )
}

export default PrivacyPolicy