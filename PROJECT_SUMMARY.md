# Black Bears Gym CMS - Project Summary

## Project Identity
**Black Bears Gym CMS** is a fully functional, highly performant landing page and Content Management System built with **Next.js (App Router)** and **Tailwind CSS**. It is designed with a sleek, modern, dark tech aesthetic infused with aggressive crimson accents suitable for a premium fight gym.

## Core Customer Features
- **Sleek Modern Landing Page**: A fully responsive, visually striking single-page application boasting dark glassmorphism effects, dynamic hover states, and smooth native scroll navigation.
- **Multi-Coach Assignment Logic**: 
  - Pricing plans are decoupled from a global contact number.
  - Each membership plan is dynamically linked to a specific, dedicated coach's phone number.
  - Clicking a plan's "WhatsApp" or "Direct Call" button automatically parses the number (including handling local Algerian prefixes by converting `0` to `213` for the WhatsApp API) and routes the lead precisely to the assigned coach.

## Admin Panel Features (Protected Layout)
- **Dedicated Secure Login Screen**: Accessible via `/login`, featuring a custom dark-themed UI that intercepts credentials and securely authenticates the administrator.
- **Live Client-Side Edit Modals**: 
  - Once authenticated, a floating red "Edit" toggle is unlocked on the DOM.
  - Toggling Admin Mode grants access to granular, interactive modals on the **Hero**, **Pricing**, and **Footer** components.
  - Admins can instantly edit text copy, media URLs, subscription prices, feature lists, social links, map embeds, and assign coach phone numbers dynamically.

## Backend Architecture Migration
The platform has been fully re-engineered from volatile browser memory to a robust **Node.js Full-Stack Architecture**.

- **Local Database Persistence**: Site configurations are permanently stored via a serverless file-system approach inside `src/data/db.json`. Reading and writing operations are safely handled asynchronously through `src/lib/db.ts`.
- **Secure API Layer**: All data hydration and state mutations flow through a fortified API architecture:
  - `POST /api/auth/login`: Validates credentials and issues secure JSON Web Tokens (JWT) with an expiration window.
  - `GET /api/gym-data`: Serves the live layout configuration state directly to the frontend components on mount.
  - `POST /api/gym-data/update`: A strictly protected mutation route. It verifies the incoming JWT in the `Authorization` header before committing layout updates directly into the persistent database.
- **Flawless Path Resolution**: All deep backend route files utilize robust Next.js absolute path aliases (e.g., `import { readDB } from '@/lib/db';`) guaranteeing the build compiles perfectly without fragile relative path chains.
