"use client";

import { useEffect } from "react";

const PLAYER_ID = "vid-6a67b33bab208488526e053a";
const PLAYER_SCRIPT =
  "https://scripts.converteai.net/6e72aa35-e6ca-4729-84f3-3bf1d076221b/players/6a67b33bab208488526e053a/v4/player.js";

export function VslPlaceholder() {
  // VTurb ships a plain <script> injection, and that's what its player expects.
  // Appending it ourselves — rather than via next/script — keeps that contract and
  // makes the load order explicit: the custom element is in the DOM before the
  // script that upgrades it runs.
  useEffect(() => {
    if (document.querySelector(`script[src="${PLAYER_SCRIPT}"]`)) return;
    const script = document.createElement("script");
    script.src = PLAYER_SCRIPT;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="mx-auto w-full max-w-[400px]">
      {/* The placeholder div reserves a square via padding-top, so mounting the
          player doesn't shift everything below it. */}
      <vturb-smartplayer id={PLAYER_ID} style={{ display: "block", margin: "0 auto", width: "100%", maxWidth: "400px" }}>
        <div
          className="vturb-player-placeholder"
          style={{ position: "relative", width: "100%", padding: "100% 0 0", zIndex: 0, backgroundColor: "black" }}
        />
      </vturb-smartplayer>
    </div>
  );
}
