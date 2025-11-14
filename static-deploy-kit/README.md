# Static Deploy Kit

A lightweight, config-based deployment kit for static Next.js exports with Cloudflare Pages and R2.

## Overview

This kit deploys **static/pre-built Next.js applications** (no backend needed):
- No database
- No Node.js server
- Pure HTML/CSS/JavaScript static assets
- CDN delivery via Cloudflare Pages
- Image storage on Cloudflare R2

Perfect for marketing sites, product catalogs, and static content apps.

## Quick Start

### 1. Configure Your Project

Edit `project.config` with your project details:

```bash
PROJECT_NAME=vl-london
DOMAIN=vllondon.chartedconsultants.com
R2_BUCKET_NAME=bucket-vllondon
R2_PUBLIC_URL=https://vllondon.chartedconsultants.com
GITHUB_REPO=your-github-repo-url
```

**Pre-configured (no changes needed):**
- R2 credentials (account ID, access keys)
- Cloudflare Pages configuration
- Static build paths

### 2. Generate Deployment Files

```bash
chmod +x setup.sh
./setup.sh
```

This creates a folder with:
- `.env.[PROJECT_NAME]` - Environment variables
- `wrangler.toml` - Cloudflare Pages config
- `deploy-[PROJECT_NAME].sh` - Deployment script

### 3. Build Your Next.js App

```bash
npm run build
```

This generates static files in the `out/` directory.

### 4. Deploy to Cloudflare Pages

```bash
cd [PROJECT_NAME]/
./deploy-vl-london.sh
```

Or manually:

```bash
wrangler pages deploy out/
```

## What Gets Generated

### Configuration File (`wrangler.toml`)
Cloudflare Pages configuration for your static site:
- Project name
- Build directory
- Environment variables
- R2 binding for images

### Deploy Script (`deploy-[PROJECT_NAME].sh`)
Automated deployment that:
1. Verifies build exists (`out/` directory)
2. Validates R2 credentials
3. Deploys to Cloudflare Pages
4. Generates deployment summary

### Environment File (`.env.[PROJECT_NAME]`)
All environment variables needed:
- R2 credentials
- Domain configuration
- Cloudflare API token

## Configuration Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PROJECT_NAME` | Project identifier | `vl-london` |
| `DOMAIN` | Your domain name | `vllondon.chartedconsultants.com` |
| `R2_BUCKET_NAME` | R2 bucket name | `bucket-vllondon` |
| `R2_PUBLIC_URL` | CDN URL | `https://vllondon.chartedconsultants.com` |
| `GITHUB_REPO` | GitHub repository URL (optional) | `https://github.com/user/repo` |

**Pre-configured (no changes needed):**
- R2 credentials
- Cloudflare API token
- Build output directory (`out/`)

## Typical Workflow

1. **Develop locally** - Build and test your Next.js app
2. **Configure** - Edit `project.config` with your domain
3. **Generate files** - Run `./setup.sh`
4. **Build static** - `npm run build` (creates `out/` directory)
5. **Deploy** - Run deployment script or `wrangler pages deploy out/`

## File Structure

```
static-deploy-kit/                  # Factory directory
├── project.config                  # Template (edit this)
├── setup.sh                         # Generator script (run this)
├── README.md                        # Documentation
│
└── [generated folders]
    ├── vl-london/                  # Generated for PROJECT_NAME=vl-london
    │   ├── .env.vl-london
    │   ├── wrangler.toml
    │   └── deploy-vl-london.sh
    │
    └── another-static/             # Generated for other projects
        ├── .env.another-static
        ├── wrangler.toml
        └── deploy-another-static.sh
```

## Deployment Methods

### Method 1: Using Deploy Script (Recommended)

```bash
cd vl-london/
./deploy-vl-london.sh
```

### Method 2: Manual with Wrangler

```bash
wrangler pages deploy out/
```

### Method 3: GitHub Integration

Connect your GitHub repo to Cloudflare Pages for automatic deployments on push:

1. Go to Cloudflare Pages dashboard
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `out`

## Next.js Configuration

Ensure your `next.config.js` is set up for static export:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

And your `package.json` has the build script:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

## Tips

- Keep `project.config` secure (don't commit sensitive data!)
- Use GitHub Actions for CI/CD automation
- Monitor Cloudflare Pages deployment logs
- Cache invalidation is automatic on deployment
- Static files are served globally via Cloudflare CDN

## Troubleshooting

**Setup script fails:**
- Ensure `project.config` has all required variables
- Check file permissions: `chmod +x setup.sh`

**Deploy fails:**
- Verify `out/` directory exists: `npm run build`
- Check Cloudflare API token is valid
- Ensure R2 credentials are correct

**Site not updating after deploy:**
- Wait 30 seconds for cache refresh
- Check Cloudflare Pages deployment status
- Clear browser cache or use incognito mode

## Performance Tips

1. **Optimize images** - Use WebP format, compress before upload
2. **Cache headers** - Cloudflare Pages sets optimal caching automatically
3. **Bundle size** - Monitor with `npm run analyze`
4. **Lazy loading** - Use Next.js `Image` component with `loading="lazy"`

## Support

For questions about deployment, consult the Cloudflare Pages documentation:
- https://developers.cloudflare.com/pages/
- https://developers.cloudflare.com/r2/
