"use client";

import { useEffect } from "react";

// Force Vercel redeployment - updated timestamp
export default function HomePage() {
  useEffect(() => {
    window.location.replace("/personas");
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <p>Redirecting...</p>
    </div>
  );
}
