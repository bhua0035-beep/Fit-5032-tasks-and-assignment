# FIT5032 eFolio - Week 11 and Week 12

> Finalisation note: replace every bracketed evidence placeholder below with the real deployment URL or screenshot before exporting this document as a single PDF. Each task is separated by a page-break marker.

## eFolio Task 11.1 - Cloudflare deployment

### Deployed project link

**Git-connected Cloudflare Pages URL:** `https://fit-5032-tasks-and-assignment.pages.dev/`

**Direct C3/Wrangler deployment URL:** `https://bhua0035-week11-12-library.pages.dev/`

### Deployment from Git

The Week 10 NoMash Library project was deployed to Cloudflare Pages from the GitHub repository. Because the project folder contains an ampersand, the Pages project keeps the repository root blank and runs `npm ci --prefix 'tasks/week11&week12' && npm --prefix 'tasks/week11&week12' run build && cp -R 'tasks/week11&week12/dist' week11-12-dist`; Cloudflare publishes `week11-12-dist`. The production branch is `main`. The OpenWeather API key is supplied as the `VITE_OPENWEATHER_API_KEY` build environment variable rather than committed to source control.

**Evidence:** `[insert evidence/week11-cloudflare-git.png here]`

### Direct deployment from the IDE using C3/Wrangler

The same project can be built and deployed directly from the IDE with `npm run deploy:cloudflare`. This command creates the Vite production build and uploads `dist` using Wrangler, the Cloudflare CLI installed by the C3 workflow.

**Evidence:** `[insert evidence/week11-cloudflare-c3.png here]`

<div style="page-break-after: always;"></div>

## eFolio Task 11.2 - Get Weather on Cloudflare

The `/WeatherCheck` route requests the browser's current location and sends the latitude and longitude to the OpenWeather current-weather API. The API key is supplied through Cloudflare's build environment instead of being committed to the repository. Because Vite embeds `VITE_*` values in the browser bundle, this prevents accidental source-control disclosure but does not make the deployed key private; the key should be domain-restricted where supported, or proxied by a server-side function for a production system. The page displays a clear loading state, handles denied geolocation and API errors, and presents the location name, country, temperature, weather icon, and description when the request succeeds.

The deployment uses Vue Router history mode. Cloudflare Pages recognises the output as a single-page application and sends unmatched application routes to the root app, so `/WeatherCheck` remains usable when it is opened directly or refreshed.

**Evidence with the Cloudflare URL visible in the browser address bar:** `[insert evidence/week11-weathercheck.png here]`

<div style="page-break-after: always;"></div>

## eFolio Task 12.1 - GitHub Actions CI/CD

### Deployed project link

**GitHub Pages URL:** `https://bhua0035-beep.github.io/Fit-5032-tasks-and-assignment/`

**Successful workflow run:** `https://github.com/bhua0035-beep/Fit-5032-tasks-and-assignment/actions/runs/39911468886`

The workflow at `.github/workflows/week11-12-pages.yml` runs on pushes to `main` that change this project and can also be started manually. It checks out the repository, installs Node.js 24, restores npm's dependency cache, installs exact locked dependencies with `npm ci`, runs ESLint as a CI quality gate, builds the Vue application with the correct repository base path, uploads the `dist` artifact, and deploys it with GitHub's official Pages actions. GitHub's environment and ID-token permissions are limited to what the Pages deployment requires.

The workflow supplies the OpenWeather key through the `VITE_OPENWEATHER_API_KEY` repository secret, so it is not stored in the workflow or source files. The resulting client bundle still contains the value, which is why a deployable browser API key must be restricted or replaced with a server-side proxy for sensitive production use.

The deployed root page and direct history-mode routes including `/WeatherCheck`, `/json-lab`, and `/books/add` were verified to return HTTP 200 after the workflow completed.

**Evidence showing the workflow running:** `[insert evidence/week12-github-action-running.png here]`

<div style="page-break-after: always;"></div>

## eFolio Task 12.2 - Web optimisation research

### Text answer 1: Time to First Byte (TTFB) and how to reduce it

Time to First Byte is the elapsed time from the start of navigation until the first byte of the response begins to arrive. It includes redirects, service-worker startup when applicable, DNS lookup, TCP connection, TLS negotiation, the request trip to the server, and the server's time to begin responding. A practical target is a TTFB of 0.8 seconds or less at the 75th percentile, although TTFB is a diagnostic metric rather than a Core Web Vital.

TTFB can be reduced by:

1. **Measure each part of the request.** Use browser DevTools, real-user monitoring, Lighthouse, or `PerformanceNavigationTiming` to distinguish DNS, connection, TLS, redirect, and server delays. Optimisation should target the slow stage instead of guessing.
2. **Serve content near the visitor.** A CDN caches static responses at edge locations, shortens the physical network path, and usually provides fast DNS plus modern HTTP/2 or HTTP/3 and TLS.
3. **Cache reusable responses.** Use suitable `Cache-Control` directives at the browser, CDN, and application layers. Hashed assets can have a long immutable lifetime, while HTML should revalidate so deployments remain current. Personalised or private data must not be placed in a shared public cache.
4. **Remove redirect chains.** Link directly to the final HTTPS URL, use one canonical host and path format, and avoid unnecessary tracking or URL-shortener hops. Every redirect adds another request-response round trip.
5. **Improve the origin.** Profile slow server code and database queries, add indexes and application caching, remove unnecessary synchronous work, reuse connections, prevent resource exhaustion, and choose hosting capacity close to the expected audience.
6. **Stream or send early hints where appropriate.** Dynamic servers can begin streaming HTML instead of waiting for all work to finish. A `103 Early Hints` response can start critical-resource discovery, but it does not repair a slow origin and offers little benefit to a simple static page.

For this Vue project, Cloudflare Pages and GitHub Pages already serve the static app through edge networks. The project also applies one-year immutable caching to hashed `/assets/*` files and avoids caching HTML. Route-level dynamic imports and vendor chunking improve download and execution after the first byte; they do not directly reduce the HTML document's TTFB, so both server timing and frontend rendering should be measured separately.

Sources:

- [web.dev - Time to First Byte](https://web.dev/articles/ttfb)
- [web.dev - Optimize Time to First Byte](https://web.dev/articles/optimize-ttfb)
- [MDN - Time to First Byte](https://developer.mozilla.org/en-US/docs/Glossary/Time_to_first_byte)

### Text answer 2: Hotlinking and how to prevent it

Hotlinking occurs when another website embeds a file from this site's URL, such as an image in an `<img>` element. The visitor sees the asset on the other website, but this site's server or CDN supplies the bytes and pays the bandwidth and processing cost. It can also detach an image from its intended attribution or context.

Ways to reduce or prevent hotlinking include:

1. **Enable host-level hotlink protection.** Cloudflare Hotlink Protection checks image requests and rejects requests whose `Referer` identifies a different website. Cloudflare currently applies this feature to common image extensions including GIF, ICO, JPG, JPEG, and PNG.
2. **Create a controlled allow-list.** Permit the site's own hosts and any trusted partner domains. Keep deliberately shareable images in a separate path; Cloudflare supports a `hotlink-ok` directory for this purpose.
3. **Use a WAF rule or edge function when more control is needed.** Inspect the request host, `Referer`, path, and content type; then return `403`, a placeholder, or a redirect for disallowed cross-site image requests. A rule should still handle a missing `Referer` deliberately because privacy tools and legitimate clients may omit it.
4. **Use signed, expiring URLs for valuable media.** Referer checks can be bypassed or omitted and therefore are not access control. Private downloads, paid video, or sensitive files need authenticated requests or short-lived signed URLs.
5. **Set an appropriate Cross-Origin-Resource-Policy header.** `Cross-Origin-Resource-Policy: same-origin` can instruct supporting browsers not to expose protected resources to other origins. Test this carefully if the site intentionally serves assets from multiple domains.
6. **Monitor and respond.** Review CDN analytics and logs for unusual referrers, paths, and bandwidth spikes; then block repeat abuse and rotate exposed media URLs if required.

There are trade-offs. Strict hotlink protection can stop images appearing in search-image previews, social networks, RSS readers, or approved third-party sites. The rule should therefore protect only the required asset paths and document any exceptions.

Sources:

- [Cloudflare - Hotlink Protection](https://developers.cloudflare.com/waf/tools/scrape-shield/hotlink-protection/)
- [Cloudflare Workers - Hot-link protection example](https://developers.cloudflare.com/workers/examples/hot-link-protection/)
- [MDN - Cross-Origin-Resource-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Resource-Policy)
