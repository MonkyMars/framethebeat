// components/CookieConsentBanner.tsx
import { useEffect, useState } from 'react';
import CookieConsent from 'react-cookie-consent';
import Link from 'next/link';

interface CookieConsentBannerProps {
  privacyPolicyUrl?: string;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ 
  privacyPolicyUrl = '/privacy-policy' 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
      setIsVisible(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Essential Only"
      onAccept={handleAccept}
      style={{
        background: 'var(--background-darker, rgba(15, 15, 15, 0.97))',
        color: 'var(--text-primary, #f8f8f8)',
        fontFamily: 'var(--font-family, system-ui, -apple-system, sans-serif)',
        padding: '18px 32px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
        fontSize: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
        zIndex: 9999,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease-in-out',
        gap: '20px',
      }}
      buttonStyle={{
        backgroundColor: 'var(--theme, #1e88e5)',
        color: 'var(--theme-contrast, white)',
        fontWeight: '600',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'transform 0.15s ease, background-color 0.15s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
      buttonWrapperClasses="cookie-buttons-wrapper"
      customButtonProps={{
        style: {
          '&:hover': {
            transform: 'translateY(-2px)',
            backgroundColor: 'var(--theme-hover, #1976d2)',
          },
        }
      }}
      onDecline={() => {
        localStorage.setItem('cookieConsent', 'declined');
        setIsVisible(false);
      }}
      declineButtonStyle={{
        backgroundColor: 'transparent',
        color: 'var(--text-secondary, #e0e0e0)',
        border: '1px solid var(--border-color, #666)',
        borderRadius: '6px',
        padding: '9px 20px',
        marginRight: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.15s ease',
      }}
      contentStyle={{
        flex: 1,
        marginRight: '20px',
      }}
      expires={365}
      cookieName="framethebeat-cookie-consent"
      overlay
      overlayStyle={{
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(3px)",
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: '6px' }}
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm0-8h-6V7h6v2z" 
              fill="var(--theme, #1e88e5)" />
          </svg>
          <span className="font-semibold">Cookie Settings</span>
        </div>
        <p style={{ margin: '0 0 6px 0' }}>
          We use cookies to enhance your experience, analyze site traffic, and personalize content.
          By clicking &quot;Accept All&qout;, you consent to our use of cookies.
        </p>
        <Link 
          href={privacyPolicyUrl} 
          style={{ 
            color: 'var(--theme, #1e88e5)', 
            textDecoration: 'none',
            fontSize: '14px',
            display: 'inline-block'
          }}
        >
          Read our Privacy Policy
        </Link>
      </div>
    </CookieConsent>
  );
};

export default CookieConsentBanner;