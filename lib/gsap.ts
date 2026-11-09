"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

// Media query con la que se activan las animaciones; con movimiento reducido todo queda visible y quieto.
export const CON_MOVIMIENTO = "(prefers-reduced-motion: no-preference)";
