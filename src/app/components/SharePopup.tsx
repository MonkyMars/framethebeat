"use client"
import React, { useState, useEffect } from "react";
import { Copy, Share2, Check, X } from "lucide-react";
import '../globals.css'
interface SharePopupProps {
  albumName: string;
  artistName: string;
  onClose: () => void;
}

const SharePopup: React.FC<SharePopupProps> = ({
  albumName,
  artistName,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHttps, setIsHttps] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  useEffect(() => {
    setMounted(true);
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    setIsHttps(window.location.protocol === "https:");
    setShareUrl(`${window.location.origin}/collection/share?artist=${encodeURIComponent(
      artistName
    )}&album=${encodeURIComponent(albumName)}`);
  }, [artistName, albumName]);

  const text = `Check out ${albumName} by ${artistName} on Frame The Beat!`;

  const shareLinks = [
    {
      url: mounted ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}\n&url=${encodeURIComponent(
        shareUrl
      )}` : '#',
      platform: "Twitter",
    },
    {
      url: mounted ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` : '#',
      platform: "Facebook",
    },
  ];

  const handleShare = (url: string) => {
    if (!mounted) return;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleOSShare = async () => {
    if (!mounted || !navigator.share) return;
    
    try {
      await navigator.share({
        title: `${albumName} by ${artistName}`,
        text: text,
        url: shareUrl,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleCopyLink = async () => {
    if (!mounted) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div style={{ visibility: mounted ? 'visible' : 'hidden' }} className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(var(--background-rgb),0.5)] backdrop-blur-md">
      <div className="bg-background p-6 rounded-lg shadow-lg w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Share this album</h2>
          <button onClick={onClose} className="p-2 hover:bg-theme hover:text-foreground rounded-full transition-all duration-200 hover:scale-110" aria-label="Close">
            <X size={24} />
          </button>
        </div>
        <p className="mb-4">
          <strong>{albumName}</strong> by <strong>{artistName}</strong>
        </p>
        <div className="flex flex-col gap-2">
          <button 
            onClick={handleCopyLink} 
            className="w-full py-2 px-4 rounded bg-theme hover:bg-theme-dark text-white transition-all duration-300 flex items-center justify-center"
          >
            {copied ? <Check size={24} className="mr-2" /> : <Copy size={24} className="mr-2" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
          
          {isMobile && isHttps && (
            <button 
              onClick={handleOSShare} 
              className="w-full py-2 px-4 rounded bg-theme hover:bg-theme-dark text-white transition-all duration-300 flex items-center justify-center"
            >
              <Share2 size={24} className="mr-2" />
              Share via OS
            </button>
          )}
          
          {shareLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleShare(link.url)}
              className="w-full py-2 px-4 rounded bg-theme hover:bg-theme-dark text-white transition-all duration-300 flex items-center justify-center"
            >
              <Share2 size={24} className="mr-2" />
              Share on {link.platform}
            </button>
          ))}
          
          <button 
            onClick={onClose} 
            className="w-full py-2 px-4 rounded bg-theme hover:bg-theme-dark text-foreground transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;