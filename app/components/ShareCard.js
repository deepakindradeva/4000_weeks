"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

/* ─── Canvas-based image generation ─────────────────────────────────────── */
function drawShareCard(canvas, { name, weeksLived, weeksRemaining, totalWeeks, percent, summersLeft, booksLeft, sunrisesLeft, weekendsLeft }) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  // Background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, W, H);

  // Radial glow — top center
  const glow = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, H * 0.8);
  glow.addColorStop(0, "rgba(41,151,255,0.12)");
  glow.addColorStop(0.4, "rgba(191,90,242,0.06)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Mini week-dot grid (top right quadrant)
  const dotSize = 5;
  const gap = 8;
  const cols = 52;
  const rows = Math.ceil(totalWeeks / cols);
  const gridW = cols * (dotSize + gap);
  const gridH = rows * (dotSize + gap);
  const gridX = W - gridW - 60;
  const gridY = 60;

  for (let i = 0; i < totalWeeks; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = gridX + col * (dotSize + gap);
    const y = gridY + row * (dotSize + gap);
    if (y + dotSize > gridY + Math.min(gridH, H - 80)) break;

    const decade = Math.floor((i / 52.1429) / 10);
    const DECADE_COLORS = ["#64d2ff","#2997ff","#5e5ce6","#bf5af2","#ff375f","#ff6b35","#e8c547","#30d5c8","#a1a1a6","#6e6e73"];
    const isLived = i < weeksLived;

    ctx.fillStyle = isLived ? (DECADE_COLORS[Math.min(decade, 9)] + "aa") : "rgba(255,255,255,0.06)";
    ctx.beginPath();
    ctx.roundRect(x, y, dotSize, dotSize, 1);
    ctx.fill();
  }

  // App name
  ctx.font = "600 18px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.letterSpacing = "0.12em";
  ctx.fillText("4,000 WEEKS", 60, 72);

  // Name line
  ctx.font = "300 28px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText(`${name}'s Timeline`, 60, 130);

  // Big week number
  ctx.font = "800 96px system-ui, -apple-system, sans-serif";
  const grad = ctx.createLinearGradient(60, 140, 400, 260);
  grad.addColorStop(0, "#ff375f");
  grad.addColorStop(1, "#ff6b35");
  ctx.fillStyle = grad;
  ctx.fillText(weeksLived.toLocaleString(), 60, 240);

  ctx.font = "300 22px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fillText(`weeks lived of ~${totalWeeks.toLocaleString()} total`, 60, 278);

  // Progress bar
  const barX = 60;
  const barY = 308;
  const barW = Math.min(W / 2 - 40, 480);
  const barH = 8;
  const fillW = (percent / 100) * barW;

  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 4);
  ctx.fill();

  const barGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
  barGrad.addColorStop(0, "#ff375f");
  barGrad.addColorStop(1, "#ff6b35");
  ctx.fillStyle = barGrad;
  ctx.beginPath();
  ctx.roundRect(barX, barY, fillW, barH, 4);
  ctx.fill();

  ctx.font = "500 13px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillText(`${percent}% complete`, barX + barW + 12, barY + 9);

  // Stats row
  const stats = [
    { icon: "☀️", value: summersLeft, label: "summers left" },
    { icon: "📖", value: booksLeft.toLocaleString(), label: "books left" },
    { icon: "🌅", value: sunrisesLeft.toLocaleString(), label: "sunrises" },
    { icon: "🛋️", value: weekendsLeft.toLocaleString(), label: "weekends" },
  ];

  stats.forEach((s, i) => {
    const sx = 60 + i * 150;
    const sy = 360;

    ctx.font = "700 28px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(s.value, sx, sy + 32);

    ctx.font = "400 13px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText(s.label, sx, sy + 52);
  });

  // Divider
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 430);
  ctx.lineTo(W - 60, 430);
  ctx.stroke();

  // Quote
  const quote = "The real measure of any time management technique is whether it helps you neglect the right things.";
  ctx.font = "italic 300 15px Georgia, serif";
  ctx.fillStyle = "rgba(255,255,255,0.4)";

  // Word wrap
  const maxW = W - 140;
  const words = quote.split(" ");
  let line = "";
  let qy = 462;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxW && line !== "") {
      ctx.fillText(line.trim(), 60, qy);
      line = word + " ";
      qy += 22;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), 60, qy);
  ctx.font = "400 13px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillText("— Oliver Burkeman", 60, qy + 22);

  // Watermark
  ctx.font = "500 14px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  const url = "4000weeks.app";
  const urlW = ctx.measureText(url).width;
  ctx.fillText(url, W - urlW - 60, H - 40);
}

/* ─── Share Card Modal ───────────────────────────────────────────────────── */
export default function ShareCard({ open, onClose }) {
  const { lifeData, isDemo } = useUser();
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [rendered, setRendered] = useState(false);

  const name = user?.displayName?.split(" ")[0] || "You";

  useEffect(() => {
    if (!open || !lifeData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 1200;
    canvas.height = 630;

    try {
      drawShareCard(canvas, {
        name,
        weeksLived: lifeData.ageWeeks,
        weeksRemaining: lifeData.remaining,
        totalWeeks: lifeData.totalWeeks,
        percent: parseFloat(lifeData.percentLived),
        summersLeft: lifeData.summersLeft,
        booksLeft: lifeData.booksLeft,
        sunrisesLeft: lifeData.sunrisesLeft,
        weekendsLeft: lifeData.weekendsLeft,
      });
      setRendered(true);
    } catch {
      setRendered(false);
    }
  }, [open, lifeData, name]);

  if (!lifeData) return null;

  const tweetText = encodeURIComponent(
    `I've lived ${lifeData.ageWeeks.toLocaleString()} of my ~${lifeData.totalWeeks.toLocaleString()} weeks (${lifeData.percentLived}%). That leaves ${lifeData.summersLeft} summers, ${lifeData.booksLeft.toLocaleString()} books, and ${lifeData.weekendsLeft.toLocaleString()} weekends. Make them count. ⏳`
  );
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  const handleDownload = () => {
    if (!canvasRef.current || !rendered) return;
    const link = document.createElement("a");
    link.download = "my-4000-weeks.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: ignore
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="sc-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="sc-modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sc-header">
              <div>
                <h3 className="sc-title">Share your timeline</h3>
                <p className="sc-subtitle">Your finite life, beautifully framed.</p>
              </div>
              <button className="sc-close" onClick={onClose} aria-label="Close">✕</button>
            </div>

            {/* Canvas preview */}
            <div className="sc-canvas-wrapper">
              <canvas
                ref={canvasRef}
                className="sc-canvas"
                aria-label="Share card preview"
              />
              {isDemo && (
                <div className="sc-demo-note">
                  Enter your birth year in the calculator above to personalize this card.
                </div>
              )}
            </div>

            {/* Stats summary */}
            <div className="sc-stats">
              <div className="sc-stat">
                <span className="sc-stat-value">{lifeData.ageWeeks.toLocaleString()}</span>
                <span className="sc-stat-label">Weeks lived</span>
              </div>
              <div className="sc-stat-div" />
              <div className="sc-stat">
                <span className="sc-stat-value">{lifeData.percentLived}%</span>
                <span className="sc-stat-label">Complete</span>
              </div>
              <div className="sc-stat-div" />
              <div className="sc-stat">
                <span className="sc-stat-value">{lifeData.summersLeft}</span>
                <span className="sc-stat-label">Summers left</span>
              </div>
              <div className="sc-stat-div" />
              <div className="sc-stat">
                <span className="sc-stat-value">{lifeData.remaining.toLocaleString()}</span>
                <span className="sc-stat-label">Weeks remaining</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="sc-actions">
              <button
                className="sc-btn sc-btn-primary"
                onClick={handleDownload}
                disabled={!rendered}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Image
              </button>

              <a
                className="sc-btn sc-btn-twitter"
                href={tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.852L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Share on X
              </a>

              <button className="sc-btn sc-btn-copy" onClick={handleCopy}>
                {copied ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
