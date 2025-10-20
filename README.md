# Circular-meters

A small Vite + React + TypeScript app that displays circular meter visualizations for survey-based satisfaction ratings pulled from Microsoft Dynamics 365 (via window.parent.Xrm / Xrm.WebApi). Styled with Tailwind CSS.

## Features
- Shows average Customer Satisfaction and Resolution Satisfaction as circular meters.
- Fetches survey records from Dynamics 365 and computes averages.
- Lightweight Vite + React + TypeScript stack.

## Prerequisites
- Node.js (16+ recommended)
- npm

## Install & run
    npm install
    npm run dev        # start dev server
    npm run build      # build for production
    npm run preview    # preview production build

## Configuration / Notes
- The app expects to run where `window.parent.Xrm` is available (e.g., inside a Dynamics form or an iframe that exposes Xrm). If Xrm is missing, the service returns zeros.
- Verify CRM entity and field names in `src/services/service.ts` (entity set name, lookup field name, and rating fields) to match your Dynamics schema.
- Known minor typos in the example service: `getAttribyute` → `getAttribute`, and a label `"Resolution S tisfaction"` → `"Resolution Satisfaction"`. Fix these if data classification fails.

## Project structure (important files)
- src/components/CircularMeter.tsx — meter UI component
- src/services/service.ts — CRM integration (fetch & compute averages)
- src/services/crmService.ts — additional CRM helpers (if used)
- src/main.tsx, src/App.tsx — app bootstrap and layout

## Troubleshooting
- If values are zero, confirm `window.parent.Xrm` is present and the correct entity/field names are used.
- Use browser devtools console to see debug logs from `src/services/service.ts`.

## License
- MIT (or choose your preferred license)
