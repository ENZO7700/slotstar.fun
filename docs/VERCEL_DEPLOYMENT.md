# SlotStar Vercel Deployment Guide

This guide explains how to deploy the SlotStar Next.js frontend application (`apps/web`) to **Vercel** from a monorepo structure.

## 1. Prerequisites
- A Vercel account linked to your GitHub/GitLab repository.
- Production WordPress endpoint URL (e.g. `https://cms.slotstars.fun`).

---

## 2. Vercel Project Configuration

When importing the project in the Vercel Dashboard, apply the following settings:

1. **Framework Preset**: `Next.js`
2. **Root Directory**: `apps/web` (Make sure to toggle the setting to include this subfolder as root).
3. **Build & Development Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install` (or leave default to let Vercel handle npm workspaces).
4. **Environment Variables**:
   Add the following production environment variables:
   - `WORDPRESS_API_URL`: `https://cms.slotstars.fun/wp-json` (Replace with your actual live WordPress URL).
   - `NEXT_PUBLIC_ENABLE_DEV_FIXTURES`: `false` (Ensures the app pulls live data from WordPress instead of the mock assets).

---

## 3. Deploying via Vercel CLI (Local Terminal)

If you prefer to deploy directly from your local terminal using the Vercel CLI, follow these steps:

1. **Log in to Vercel**:
   ```bash
   vercel login
   ```
2. **Link Project**:
   Run the link command in the repository root or inside the `apps/web` directory:
   ```bash
   cd apps/web
   vercel link
   ```
   Select your Vercel team, choose to link to a new project, and name it `slotstars.fun`.

3. **Configure Monorepo settings** if prompted, or verify that Vercel recognizes the root directory as `apps/web`.

4. **Deploy to Staging**:
   ```bash
   vercel
   ```
5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

---

## 4. Continuous Integration (GitHub Integration)

The recommended setup is linking Vercel to your Git repository:
- Any push to the `main` branch will automatically trigger a production build.
- Pull Requests will automatically generate staging/preview deployments.
