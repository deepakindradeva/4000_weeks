"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const QUOTES = [
  { text: "The real problem of humanity is that we have Paleolithic emotions, medieval institutions, and godlike technology.", author: "E.O. Wilson" },
  { text: "The price of anything is the amount of life you exchange for it.", author: "Henry David Thoreau" },
  { text: "It is not that we have a short time to live, but that we waste a great deal of it.", author: "Seneca" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "We suffer more in imagination than in reality.", author: "Seneca" },
  { text: "The present is the only thing of which a man can be deprived.", author: "Marcus Aurelius" },
  { text: "He who fears death will never do anything worthy of a man who is alive.", author: "Seneca" },
  { text: "When we are no longer able to change a situation, we are challenged to change ourselves.", author: "Viktor Frankl" },
  { text: "The chief task in life is simply this: to identify and separate matters so that I can say clearly to myself which are externals not under my control, and which have to do with the choices I actually control.", author: "Epictetus" },
  { text: "You could leave life right now. Let that determine what you do and say and think.", author: "Marcus Aurelius" },
  { text: "Time is a created thing. To say 'I don't have time' is to say 'I don't want to.'", author: "Lao Tzu" },
  { text: "The more you try to squeeze value out of your time, the more it feels like your life is on a treadmill of tasks.", author: "Oliver Burkeman" },
  { text: "Convenience, in other words, makes things easy, but without effort they tend to feel hollow.", author: "Oliver Burkeman" },
  { text: "The real measure of any time management technique is whether it helps you neglect the right things.", author: "Oliver Burkeman" },
  { text: "Productivity is a trap. Becoming more efficient just makes you more rushed.", author: "Oliver Burkeman" },
  { text: "The problem isn't that you don't have enough time, it's that you were never going to have enough time.", author: "Oliver Burkeman" },
  { text: "We don't get or have time at all. We are time. We are the doing of the things we do.", author: "Oliver Burkeman" },
  { text: "Missing out on something — indeed, on almost everything — is basically guaranteed. Which isn't actually a problem.", author: "Oliver Burkeman" },
  { text: "The average human lifespan is absurdly, terrifyingly, insultingly short. But that isn't a reason for despair.", author: "Oliver Burkeman" },
  { text: "Cosmic insignificance therapy: the recognition that you're so cosmically unimportant that the pressure's off.", author: "Oliver Burkeman" },
  { text: "To do one thing means to let a hundred other things go undone. But that's what gives the choice its meaning.", author: "Oliver Burkeman" },
  { text: "The future is not something we go towards but something that comes towards us.", author: "Heidegger (paraphrased)" },
  { text: "Attention, on the other hand, just is life: your experience of being alive consists of nothing other than the sum of everything to which you pay attention.", author: "Oliver Burkeman" },
  { text: "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.", author: "Joyce Meyer" },
];

export default function QuoteRotator() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Start at a random quote
    setIndex(Math.floor(Math.random() * QUOTES.length));

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const quote = QUOTES[index];

  return (
    <section className="section quote-rotator-section" id="wisdom" ref={ref}>
      <div className="section-inner" style={{ textAlign: "center" }}>
        <motion.div
          className="section-label"
          style={{ color: "var(--color-accent-gold)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Daily Wisdom
        </motion.div>

        <div className="qr-container">
          <span className="qr-mark">&ldquo;</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote className="qr-text">{quote.text}</blockquote>
              <cite className="qr-author">— {quote.author}</cite>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="qr-dots">
          {QUOTES.slice(0, Math.min(QUOTES.length, 12)).map((_, i) => (
            <button
              key={i}
              className={`qr-dot ${i === index % 12 ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Quote ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
