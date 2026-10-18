# EcoYouth Action - A3 Current Implementation

## Overview

EcoYouth Action is a Vue 3 single-page application supporting young people experiencing eco-anxiety. The project combines Firebase Authentication, interactive data tables, appointment conflict management, geolocation features, data exports, analytics, accessibility controls, and administration interfaces.

## Implemented Features

- **BR (D.1) External Authentication**: Firebase Authentication supports email/password and Google Sign-In. A local demonstration fallback is also available for offline evaluation.
- **BR (D.2) Email with Attachments**: The Email Center provides single-recipient and bulk campaign interfaces with generated PDF attachment options. Dispatch is currently simulated in the frontend; the SendGrid Cloud Function scaffold has not been connected to the interface or deployed.
- **BR (D.3) Interactive Table Data**: The Resources and Events tables support global search, individual column filters, sorting, and pagination limited to 10 rows per page.
- **BR (C.3) Rating**: Resources include an interactive five-star rating system with average scores and vote counts.
- **BR (E.1) Cloud Functions**: Local Cloud Functions scaffolding includes email, statistics, and REST API handlers for resources and events. The separately developed `countBooks` function is deployed; the A3 functions in this directory are not yet deployed.
- **BR (E.2) Geo Location**: The Leaflet map supports browser geolocation, location filtering, straight-line distance calculation, travel-time estimates, and illustrative route polylines.
- **BR (E.3) Accessibility**: The interface includes skip navigation, visible focus styles, semantic markup, ARIA labels, font-size controls, and a high-contrast mode targeting WCAG 2.1 AA.
- **BR (E.4) Export**: Resource and event data can be exported as CSV and PDF files.

## Innovation Features

- **Appointment Conflict Management**: Counseling appointments are checked against Vue reactive state and `localStorage`, with alternative time slots suggested when conflicts occur.
- **Interactive Analytics**: Chart.js visualisations display event capacity, resource ratings, appointment totals, and demonstration wellbeing trends using locally managed data.
- **Admin Dashboard**: Administrators can view user totals, role distributions, application metrics, and activity information.
- **Bulk Campaign Interface**: Administrators can select recipients, choose templates and PDF options, and preview simulated dispatch progress.
- **Coping Assistant Prototype**: A client-side, rule-based assistant provides predefined responses based on keywords. It does not call an external generative AI service.
- **Offline Support**: Network status is displayed in the navigation bar, while selected application data and preferences persist through `localStorage`.

## Firebase and Deployment Status

- Firebase project: `fit5032a1-62b71`
- Live Firebase Hosting site: https://fit5032a1-62b71.web.app
- The production build and primary SPA routes, including `/resources` and `/email-center`, were verified after deployment on 18 October 2026.
- The A3 email, statistics, and REST API Cloud Functions remain local scaffolding and were not included in the Hosting-only deployment.
- The `/api/**` Hosting rewrite is reserved for the local `api` Function and will return 404 until that Function is deployed.
- The local Functions runtime is still configured for Node.js 18 and should be upgraded to a supported runtime before deployment.

## Run Locally

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Main Routes

- `/` - Home
- `/resources` - Resources library
- `/events` - Events directory
- `/map` - Impact map
- `/calendar` - Counseling booking
- `/analytics` - Analytics and charts
- `/ai-coach` - Coping assistant prototype
- `/email-center` - Administrator email interface
- `/admin` - Administrator dashboard
- `/auth` - Sign in and registration
