import React from "react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import "../styles.scss"
import Link from "next/link";

const TermsOfService = () => {
  return (
    <>
      <Nav/>
      <main className="mainContainer">
        <div className="privacy-content">
          <h1>Terms of Service</h1>
          
          <h2>1. Introduction</h2>
          <p>Welcome to Frame The Beat. By accessing and using our website, you agree to be bound by these Terms of Service (&quot;Terms&quot;). Please read these Terms carefully before using our services.</p>

          <h2>2. Eligibility</h2>
          <p>To use our services, you must be:</p>
          <ul>
            <li>At least 13 years old</li>
            <li>Legally capable of entering into binding contracts</li>
            <li>Not prohibited from using our services under applicable laws</li>
          </ul>

          <h2>3. User Responsibilities</h2>
          <p>When using our services, you agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Not engage in unauthorized access or use</li>
            <li>Not use the service for illegal purposes</li>
            <li>Not interfere with other users&apos; access</li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <p>All content on Frame The Beat, including but not limited to text, graphics, logos, and software, is our exclusive property and is protected by copyright and other intellectual property laws.</p>

          <h2>5. Termination</h2>
          <p>We reserve the right to suspend or terminate your access to our services:</p>
          <ul>
            <li>For violations of these Terms</li>
            <li>For fraudulent or illegal activities</li>
            <li>To protect our users or services</li>
          </ul>

          <h2>6. Disclaimers and Limitations</h2>
          <p>Our services are provided &quot;as is&quot; without any warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>

          <h2>7. Governing Law</h2>
          <p>These Terms are governed by and construed in accordance with the laws of the European Union, without regard to its conflict of law principles.</p>

          <h2>8. Modifications</h2>
          <p>We may modify these Terms at any time. Continued use of our services after changes constitutes acceptance of the modified Terms.</p>

          <h2>9. Contact Us</h2>
          <p>For questions about these Terms, please contact us at: <Link href="mailto:support@framethebeat.com">support@framethebeat.com</Link></p>
        </div>
      </main>
      <Footer/>
    </>
  )
}

export default TermsOfService;