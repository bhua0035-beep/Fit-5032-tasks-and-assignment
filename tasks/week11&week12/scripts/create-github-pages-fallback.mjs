import { copyFile, mkdir } from 'node:fs/promises'

// GitHub Pages has no native SPA rewrite. Serving the built app as 404.html
// lets Vue Router handle direct visits such as /WeatherCheck.
const indexFile = new URL('../dist/index.html', import.meta.url)

await copyFile(indexFile, new URL('../dist/404.html', import.meta.url))

// Generate static entry points for every known route so GitHub Pages returns
// HTTP 200 (rather than its custom 404 status) for direct route visits.
const routes = [
  'WeatherCheck',
  'week5-registration',
  'json-lab',
  'register',
  'login',
  'CountBookAPI',
  'account',
  'books/add'
]

for (const route of routes) {
  const routeDirectory = new URL(`../dist/${route}/`, import.meta.url)
  await mkdir(routeDirectory, { recursive: true })
  await copyFile(indexFile, new URL('index.html', routeDirectory))
}

console.log(`Created dist/404.html and ${routes.length} route entry points for GitHub Pages.`)
