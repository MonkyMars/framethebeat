import React, { useState } from "react";
import { Copy, Share2, Check } from "lucide-react";
import styles from "../page.module.scss";

interface SharePopupProps {
  albumName: string;
  artistName: string;
}

const SharePopup: React.FC<SharePopupProps> = ({ albumName, artistName }) => {
    const [copied, setCopied] = useState(false);
    
    const shareUrl = encodeURIComponent(`${window.location.origin}/share?artist=${artistName}&album=${albumName}`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=Check out ${albumName} by ${artistName} \n &url=${shareUrl}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(decodeURIComponent(shareUrl));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = (url: string) => {
        window.open(url, '_blank', 'width=600,height=400');
    };

    return (
        <div className={styles.sharePopup}>
            <div className={styles.sharePopup__content}>
          <h2 className={styles.sharePopup__title}>Share this album</h2>
          <div className={styles.sharePopup__links}>
              <button 
            onClick={handleCopyLink}
            className={styles.sharePopup__button}
              >
            {copied ? <Check size={24} /> : <Copy size={24} />}
            <span>{copied ? 'Copied!' : 'Copy link'}</span>
              </button>
              <button 
            onClick={() => handleShare(twitterUrl)}
            className={styles.sharePopup__button}
              >
            <Share2 size={24} />
            <span>Share on Twitter</span>
              </button>
              <button 
            onClick={() => handleShare(facebookUrl)}
            className={styles.sharePopup__button}
              >
            <Share2 size={24} />
            <span>Share on Facebook</span>
              </button>
          </div>
            </div>
        </div>
    );
};

export default SharePopup;