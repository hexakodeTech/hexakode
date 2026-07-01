"use client";

import { useEffect, useRef } from "react";
import clarity from "@microsoft/clarity";

export default function ClarityTracker() {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (!clarityId) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Clarity Tracker: NEXT_PUBLIC_CLARITY_PROJECT_ID is not defined.");
      }
      return;
    }

    hasInitialized.current = true;
    clarity.init(clarityId);

    if (process.env.NODE_ENV === "development") {
      console.log(`Clarity Tracker: Initialized with ID "${clarityId}"`);
    }
  }, []);

  return null;
}
