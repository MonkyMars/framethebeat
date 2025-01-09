import React, { useState } from "react";
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

  const shareUrl = `${window.location.origin}/collection/share?artist=${encodeURIComponent(
    artistName
  )}&album=${encodeURIComponent(albumName)}`;
  const text = `Check out ${albumName} by ${artistName} on Frame The Beat!`;

  const shareLinks = [
    {
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}\n&url=${encodeURIComponent(
        shareUrl
      )}`,
      platform: "Twitter",
    },
    {
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      platform: "Facebook",
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (url: string) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleOSShare = async () => {
    if (
      navigator.share &&
      window.matchMedia("(pointer: coarse)").matches &&
      document.location.protocol === "https:"
    ) {
      try {
        await navigator.share({
          title: `${albumName} by ${artistName}`,
          text: text,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Failed to share:", err);
      }
    } else {
      alert("OS sharing is not available on this device or browser.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg w-80">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Share this album</h2>
        <button onClick={onClose} className="p-2 hover:bg-theme hover:text-theme rounded-full transition-all duration-200 hover:scale-110" aria-label="Close">
        <X size={24} />
        </button>
      </div>
      <p className="mb-4">
        <strong>{albumName}</strong> by <strong>{artistName}</strong>
      </p>
      <div className="flex flex-col gap-2">
        <button onClick={handleCopyLink} className="w-full py-2 px-4 rounded transition-all duration-300 flex align-center justify-center">
        {copied ? <Check size={24} className="mr-2" /> : <Copy size={24} className="mr-2" />}
        {copied ? "Copied!" : "Copy link"}
        </button>
        
        {window.matchMedia("(pointer: coarse)").matches &&
        document.location.protocol === "https:" && (
          <button onClick={handleOSShare} className="w-full py-2 px-4 rounded transition-all duration-300 flex align-center justify-center">
          <Share2 size={24} className="mr-2" />
          Share via OS
          </button>
        )}
        
        {shareLinks.map((link, index) => (
        <button
          key={index}
          onClick={() => handleShare(link.url)}
          className=" w-full py-2 px-4 rounded transition-all duration-300 flex align-center justify-center"
        >
          <Share2 size={24} className="mr-2" />
          Share on {link.platform}
        </button>
        ))}
        
        <button onClick={onClose} className="mt-4 bg-red-600 text-white hover:bg-red-700">
        Close
        </button>
      </div>
      </div>
    </div>
  );
};

export default SharePopup;