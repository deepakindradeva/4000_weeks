"use client";

import { useState } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Premise from "./components/Premise";
import ParallaxQuote from "./components/ParallaxQuote";
import KeyIdeas from "./components/KeyIdeas";
import Tools from "./components/Tools";
import FullscreenQuote from "./components/FullscreenQuote";
import Calculator from "./components/Calculator";
import PerspectivesSection from "./components/PerspectivesSection";
import QuoteRotator from "./components/QuoteRotator";
import LifeTracker from "./components/LifeTracker";
import Footer from "./components/Footer";
import ThemeToggle from "./components/ThemeToggle";
import HeartbeatBorder from "./components/HeartbeatBorder";

export default function Home() {
  const [selectedFigure, setSelectedFigure] = useState(null);

  return (
    <main>
      <Navigation />
      <Hero />

      <Premise />

      <ParallaxQuote
        quote="The trouble with attempting to master your time is that time ends up mastering you."
        highlight="time ends up mastering you"
        attribution="Oliver Burkeman"
        variant="mastery"
      />

      <KeyIdeas />

      <ParallaxQuote
        quote="If you didn't have to decide what to miss out on, your choices couldn't truly mean anything."
        highlight="your choices couldn't truly mean anything"
        attribution="Four Thousand Weeks"
        variant="meaning"
      />

      <Tools />

      <FullscreenQuote />

      <Calculator />

      <PerspectivesSection
        selectedFigure={selectedFigure}
        onSelectFigure={setSelectedFigure}
      />

      <LifeTracker selectedFigure={selectedFigure} />

      <QuoteRotator />

      <Footer />
      <ThemeToggle />
      <HeartbeatBorder />
    </main>
  );
}
