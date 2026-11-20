# KARIGAR — The Art of Indian Craft

A premium Indian handicrafts storefront demo built with React, TypeScript, and Vite.

## Run locally

```sh
npm ci
npm run dev
```

## Check and build

```sh
npm run typecheck
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Push this project to a GitHub repository.
2. In the repository, open **Settings → Pages** and set the source to **GitHub Actions**.
3. Push to the repository's default branch. The workflow checks TypeScript, builds the site, and deploys it to GitHub Pages.

The Vite configuration automatically uses the repository subpath for project sites and `/` for `*.github.io` user or organization sites.

## Demo note

This is a demo storefront. It does not process payments or place orders. Update the placeholder contact, social, and policy details in `src/config/brand.ts` before using it for a real business.
