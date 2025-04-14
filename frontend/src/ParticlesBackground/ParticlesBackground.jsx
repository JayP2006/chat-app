// src/components/ParticlesBackground.jsx
import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 z-0"
      options={{
        fullScreen: { enable: false },
        background: { color: "#00000000" },
        particles: {
          number: { value: 50 },
          size: { value: 2 },
          move: { enable: true, speed: 1 },
          color: { value: "#ffffff" },
          links: { enable: true, distance: 130, color: "#ffffff", opacity: 0.4 },
        },
      }}
    />
  );
}
