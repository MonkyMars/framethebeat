import React from "react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

const TermsOfService = () => {
  return (
    <>
      <Nav />
      <main className="max-w-[1200px] mx-auto p-8 min-h-[calc(100vh-70px)]">
        <div className="my-8 mx-auto max-w-[900px]">
          <h1
            className="text-2xl md:text-4xl font-extrabold uppercase mb-8"
            style={{
              textShadow:
                "0 0 15px rgba(255, 255, 255, 0.6), 0 0 25px rgba(255, 255, 255, 0.4), 0 0 35px rgba(var(--theme-rgb), 0.3)",
            }}
          >
            Terms of Service
          </h1>

          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">
            1. Introduction
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
            Welcome to Frame The Beat. By accessing and using our website, you
            agree to be bound by these Terms of Service (&quot;Terms&quot;).
            Please read these Terms carefully before using our services.
          </p>

          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">
            2. Eligibility
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
            To use our services, you must be:
          </p>
          <ul className="list-none ml-5 mb-4">
            <li className="relative pl-5 leading-relaxed mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">
              At least 13 years old
            </li>
            <li className="relative pl-5 leading-relaxed mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">
              Legally capable of entering into binding contracts
            </li>
            <li className="relative pl-5 leading-relaxed mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">
              Not prohibited from using our services under applicable laws
            </li>
          </ul>

          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">
            3. User Responsibilities
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
            When using our services, you agree to:
          </p>
          <ul className="list-none ml-5 mb-4">
            <li className="relative pl-5 leading-relaxed mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">
              Provide accurate and complete information
            </li>
            <li className="relative pl-5 leading-relaxed mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">
              Maintain the security of your account
            </li>
            <li className="relative pl-5 leading-relaxed mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">
              Not engage in unauthorized access or use
            </li>
            <li className="relative pl-5 leading-relaxed mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">
              Not use the service for illegal purposes
            </li>
            <li className="relative pl-5 leading-relaxed mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">
              Not interfere with other users&apos; access
            </li>
          </ul>

          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">
            4. Intellectual Property
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
            All content on Frame The Beat, including but not limited to text,
            graphics, logos, and software, is our exclusive property and is
            protected by copyright and other intellectual property laws.
          </p>

          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">
            5. Termination
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
            We reserve the right to suspend or terminate your access to our
            services:
          </p>
          <ul className="list-none ml-5 mb-4">
            <li className="relative pl-5 leading-relaxed mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">
              For violations of these Terms
            </li>
            <li className="relative pl-5 leading-relaxed mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">
              For fraudulent or illegal activities
            </li>
            <li className="relative pl-5 leading-relaxed mb-2 text-[rgba(var(--foreground-rgb),0.9)] before:content-['•'] before:absolute before:left-0 before:text-[color:var(--theme)] before:mr-2">
              To protect our users or services
            </li>
          </ul>

          <h2 className="text-xl md:text-2xl mt-8 mb-4 text-[color:var(--foreground)]">
            6. Disclaimers and Limitations
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
            Our services are provided &quot;as is&quot; without any warranties.
            We are not liable for any indirect, incidental, or consequential
            damages arising from your use of our services.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsOfService;
