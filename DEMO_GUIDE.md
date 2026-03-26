# Maritime OS | Demo Guide & System Overview

Welcome to the **Maritime OS** demo guide. This document is designed to help you navigate the application, explain its core value proposition, and demonstrate its features with confidence.

---

## 1. Executive Summary
**Maritime OS** is a next-generation Fleet Command Center designed for global shipping logistics and maritime operations. It provides real-time vessel tracking, predictive analytics, and centralized fleet management through a high-performance, secure web interface.

**Key Value Prop:** "Transforming raw maritime data into actionable intelligence for safer, more efficient global trade."

---

## 2. The Demo Flow (Step-by-Step)

### Step 1: Authentication & First Impression
*   **Action:** Start at the Login screen.
*   **Narrative:** "Maritime OS uses enterprise-grade JWT authentication. Notice the clean, high-contrast interface designed for low-light bridge environments."
*   **Login:** Use `admin@maritime.os` / `admin123`.

### Step 2: Fleet Dashboard (The "Pulse")
*   **Action:** Navigate to the Dashboard.
*   **Highlight:**
    *   **Fleet Status:** Real-time counters of active vs. anchored vessels.
    *   **Live Alerts:** Show the "Critical Congestion" or "Weather Warning" cards.
    *   **Global Weather:** Point out the integrated weather API data for key ports (Singapore, Rotterdam).
*   **Narrative:** "The dashboard provides an immediate 'pulse' of the entire fleet. Operations managers can spot anomalies in seconds."

### Step 3: Real-Time Tracking (The "Map")
*   **Action:** Go to the Tracking page.
*   **Highlight:**
    *   **Interactive Map:** Zoom in on a vessel (e.g., *Ever Given II*).
    *   **Vessel Details:** Click a vessel to see speed, heading, and cargo.
    *   **Predictive Path:** Note the dashed line showing the AI-calculated optimal route.
    *   **Fullscreen Mode:** Click the expand icon in the top-right of the map.
*   **Narrative:** "Our tracking engine combines AIS data with predictive modeling. We don't just see where ships are; we predict where they'll be and identify potential delays before they happen."

### Step 4: Predictive Analytics (The "Brain")
*   **Action:** Go to the Analytics page.
*   **Highlight:**
    *   **Efficiency Trends:** Show the fuel consumption vs. speed charts.
    *   **Cargo Distribution:** Explain the cargo weight vs. capacity balance.
*   **Narrative:** "Data is only useful if it drives efficiency. Our analytics engine identifies patterns in fuel consumption and port turnaround times to optimize the bottom line."

### Step 5: Admin & Security (The "Control")
*   **Action:** Go to the Admin Command Center (only visible if logged in as Admin).
*   **Highlight:** System health monitors and user audit logs.
*   **Action:** Go to Settings -> Profile.
*   **Highlight:** Change your **Role** or **Organization** to show the live sync.
*   **Narrative:** "Security is paramount. Maritime OS features robust Role-Based Access Control (RBAC) and full audit logging for compliance."

---

## 3. Technical Stack (For the "How does it work?" questions)

*   **Frontend:** React 18 with TypeScript for type-safe, scalable code.
*   **Styling:** Tailwind CSS for a modern, responsive "Glassmorphism" aesthetic.
*   **Animations:** Framer Motion for smooth, high-end UI transitions.
*   **Mapping:** Leaflet.js for high-performance geospatial visualization.
*   **Charts:** Recharts for interactive, data-driven SVG visualizations.
*   **Real-time:** Socket.io for live telemetry updates from the fleet.
*   **Backend:** Node.js/Express with JWT (JSON Web Tokens) for secure session management.

---

## 4. Key Talking Points (The "Why")

1.  **Operational Efficiency:** "We reduce port idle time by an average of 12% through predictive scheduling."
2.  **Safety & Compliance:** "Real-time weather overlays and geofencing ensure vessels stay within safe corridors."
3.  **Scalability:** "The architecture is built to handle thousands of concurrent data streams from global AIS providers."
4.  **User-Centric Design:** "Built for the people on the front lines—clear typography, dark-mode default, and one-click access to critical data."

---

## 5. Quick Reference: Demo Credentials
*   **Admin User:** `admin@maritime.os` / `admin123`
*   **Standard User:** `user@maritime.os` / `user123`

