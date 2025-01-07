import React, { useState } from "react";
import { Copy, Share2, Check, X } from "lucide-react";
import styles from "./SharePopup.module.scss";

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
    <div className={styles.sharePopupOverlay}>
      <div className={styles.sharePopupContainer}>
        <div className={styles.sharePopupHeader}>
          <h2 className={styles.sharePopupTitle}>Share this album</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <X size={24} />
          </button>
        </div>
        <div className={styles.sharePopupBody}>
          <p>
            <strong>{albumName}</strong> by <strong>{artistName}</strong>
          </p>
          <div className={styles.shareButtonsRow}>
            <button onClick={handleCopyLink} className={styles.shareButton}>
              {copied ? <Check size={24} /> : <Copy size={24} />}
              <span>{copied ? "Copied!" : "Copy link"}</span>
            </button>
            {window.matchMedia("(pointer: coarse)").matches &&
              document.location.protocol === "https:" && (
                <button onClick={handleOSShare} className={styles.shareButton}>
                  <Share2 size={24} />
                  <span>Share via OS</span>
                </button>
            )}
            {shareLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleShare(link.url)}
                className={styles.shareButton}
              >
                <Share2 size={24} />
                <span>Share on {link.platform}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;