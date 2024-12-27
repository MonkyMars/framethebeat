import React, { useState } from "react";
import { Copy, Share2, Check, X } from "lucide-react";
import styles from "../page.module.scss";

interface SharePopupProps {
  albumName: string;
  artistName: string;
  onClose: () => void;
}

const SharePopup: React.FC<SharePopupProps> = ({ albumName, artistName, onClose }) => {
    const [copied, setCopied] = useState(false);

    const shareUrl = encodeURIComponent(`${window.location.origin}/share?artist=${artistName}&album=${albumName}`);
    const text = encodeURIComponent(`Check out ${albumName} by ${artistName}`);
    
    const shareLinks = [
      {
        url: `https://twitter.com/intent/tweet?text=${text}\n&url=${shareUrl}`,
        platform: 'Twitter'
      },
      {
        url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        platform: 'Facebook'
      },
      {
        url: `https://wa.me/?text=${text}%20${shareUrl}`,
        platform: 'WhatsApp'
      },
      {
        url: `https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=${shareUrl}&response_type=code&scope=identify`,
        platform: 'Discord'
      }
    ]
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
                <button 
                    onClick={onClose}
                    className={styles.sharePopup__close}
                    aria-label="Close"
                >
                    <X size={24} />
                </button>
                <h2 className={styles.sharePopup__title}>Share this album</h2>
                <div className={styles.sharePopup__links}>
                    <button 
                        onClick={handleCopyLink}
                        className={styles.sharePopup__button}
                    >
                        {copied ? <Check size={24} /> : <Copy size={24} />}
                        <span>{copied ? 'Copied!' : 'Copy link'}</span>
                    </button>
                    {shareLinks.map((link, index) => (
                        <button 
                            key={index}
                            onClick={() => handleShare(link.url)}
                            className={styles.sharePopup__button}
                        >
                            <Share2 size={24} />
                            <span>Share on {link.platform}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SharePopup;