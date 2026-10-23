# FIT5032 Week 11 and Week 12 eFolio

This folder continues the Week 10 NoMash Library Vue application and adds the hosting, CI/CD, and optimisation work required for the Week 11 and Week 12 eFolio.

## What is included

- The full Week 10 application, including Firebase authentication, Firestore activities, and the OpenWeather `/WeatherCheck` page.
- Cloudflare Pages configuration for both Git-connected builds and direct IDE/CLI deployment with Wrangler (the deployment tool installed by C3).
- A GitHub Actions workflow that builds the project and deploys it to GitHub Pages.
- History-mode routing that works under a GitHub repository sub-path.
- Route-level code splitting, separate vendor chunks, and long-lived caching for hashed static assets.
- Prepared eFolio answers and an evidence checklist in [`EFOLIO_SUBMISSION.md`](./EFOLIO_SUBMISSION.md).

## Local setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy `.env.example` to `.env.local` and replace the example value with the existing Week 10 OpenWeather key.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the URL printed by Vite and test `/WeatherCheck`. The browser must be allowed to use the current location.

## Verification commands

```bash
npm run lint:check
npm run build
npm run build:github
npm run preview
```

`build:github` creates `dist/404.html` plus static entry pages for every known Vue route. This keeps history-mode URLs and ensures direct visits such as `/WeatherCheck` return HTTP 200 on GitHub Pages.

## Week 11: Cloudflare Pages

### 11.1a - Deploy from Git

Create a Cloudflare Pages project connected to the repository and use:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | `tasks/week11&week12` |
| Build command | `npm ci && npm run build` |
| Build output directory | `dist` |
| Environment variable | `VITE_OPENWEATHER_API_KEY` = the Week 10 OpenWeather key |

After deployment, open `/WeatherCheck`, allow location access, and confirm that the weather card displays a place, temperature, icon, and description.

### 11.1b - Deploy directly from the IDE with C3/Wrangler

The project includes `wrangler.jsonc` and the Wrangler CLI. Sign in once, then deploy:

```bash
npm run cloudflare:login
npm run deploy:cloudflare
```

The configured Pages project name is `bhua0035-week11-12-library`. If that name is already taken in the Cloudflare account, change only the `name` value in `wrangler.jsonc` and run the deployment again.

For local Cloudflare Pages emulation:

```bash
npm run preview:cloudflare
```

## Week 12: GitHub Actions and GitHub Pages

Because the existing repository contains several weekly projects, the active workflow is at the repository root:

```text
.github/workflows/week11-12-pages.yml
```

The copy at `.github/workflows/deploy.yml` inside this folder is ready for use if this project is later moved to its own repository.

Before the first run:

1. In GitHub, open **Settings > Secrets and variables > Actions** and add a repository secret named `VITE_OPENWEATHER_API_KEY`.
2. Open **Settings > Pages** and select **GitHub Actions** as the source.
3. Push the project and root workflow to `main`, or run the workflow manually from **Actions**.
4. Capture the workflow while it is running and after it succeeds.
5. Verify the deployed home page and `/WeatherCheck` route.

The deployed GitHub Pages address for the current remote is:

```text
https://bhua0035-beep.github.io/Fit-5032-tasks-and-assignment/
```

`VITE_*` values are embedded in the browser bundle. Storing the key in a build setting prevents it from being committed, but it does not make the built key private. Restrict the OpenWeather key to the deployment domains if the provider supports it; a production application should proxy sensitive credentials through a server-side function.

## Evidence and submission

Do not fabricate platform screenshots. Add the four real captures described in `evidence/README.md`, replace the evidence placeholders in `EFOLIO_SUBMISSION.md`, and export the final document as one PDF with each task starting on a new page.
