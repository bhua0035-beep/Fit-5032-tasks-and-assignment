import { copyFile } from 'node:fs/promises'

// GitHub Pages has no native SPA rewrite. Serving the built app as 404.html
// lets Vue Router handle direct visits such as /WeatherCheck.
await copyFile(new URL('../dist/index.html', import.meta.url), new URL('../dist/404.html', import.meta.url))

console.log('Created dist/404.html for GitHub Pages history-mode routing.')
