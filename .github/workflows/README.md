# GitHub Actions Workflows

Automated CI/CD workflows for VL London static site deployment.

## Workflows

### 1. `build.yml` - Build & Test

Runs on every push and pull request.

**What it does:**
- Checks out code
- Installs dependencies
- Runs linter (optional)
- Builds static site (`npm run build`)
- Verifies build output
- Uploads build artifacts to GitHub

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Artifacts:**
- Build output saved for 7 days
- Can download from Actions tab

### 2. `deploy.yml` - Deploy to Cloudflare Pages

Runs on push to main branch only.

**What it does:**
- Builds static site
- Uses static deploy kit (`static-deploy-kit/vl-london/deploy-vl-london.sh`)
- Deploys to Cloudflare Pages via wrangler
- Creates deployment record in GitHub
- Comments on PRs with build status
- Notifies on failures

**How it works:**
1. Builds Next.js app to static files (`npm run build` → `out/`)
2. Sets up environment variables from GitHub Secrets
3. Runs deploy kit script: `./deploy-vl-london.sh`
4. Deploy script uses `wrangler pages deploy out/` to upload to Cloudflare

**Triggers:**
- Push to `main` branch only
- Manual trigger available

**Deployment:**
- Automatic deployment to: `https://vllondon.chartedconsultants.com`
- Updates on every commit to main

## Setup

### 1. Add GitHub Secrets

Go to **Settings > Secrets and variables > Actions** and add:

**Cloudflare & Deployment:**
```
CLOUDFLARE_API_TOKEN      # Cloudflare API token (with Pages access)
DOMAIN                    # vllondon.chartedconsultants.com
```

**R2 Configuration:**
```
R2_ACCOUNT_ID             # f47d23c072e7b2f871ecca11e36e0b25
R2_ACCESS_KEY_ID          # Your R2 access key
R2_SECRET_ACCESS_KEY      # Your R2 secret key
R2_BUCKET_NAME            # bucket-vllondon
R2_PUBLIC_URL             # https://vllondon.chartedconsultants.com
R2_ENDPOINT               # https://[ACCOUNT_ID].r2.cloudflarestorage.com/
```

**Note:** These secrets are used by the static deploy kit (`static-deploy-kit/vl-london/deploy-vl-london.sh`) during deployment.

### 2. Configure Next.js for Static Export

Ensure `next.config.js` has:

```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

### 3. Add Build Script

Ensure `package.json` has:

```json
{
  "scripts": {
    "build": "next build",
    "lint": "next lint"
  }
}
```

## Usage

### Automatic Deployments

Every push to `main` automatically:
1. ✅ Runs build tests
2. 📦 Generates static files
3. 📤 Deploys to Cloudflare Pages
4. 📝 Creates deployment record

### Manual Deployments

**Via GitHub UI:**
1. Go to **Actions** tab
2. Select **Deploy to Cloudflare Pages**
3. Click **Run workflow**
4. Select branch (usually `main`)

**Via CLI:**
```bash
gh workflow run deploy.yml -r main
```

### Check Status

**View logs:**
1. Go to **Actions** tab
2. Click on the workflow run
3. Expand step details

**Check deployment:**
1. Go to **Deployments** tab
2. View deployment history
3. Click environment for details

## Environment Variables

These are automatically set during build:

- `NEXT_PUBLIC_MEDIA_BASE_URL` - Points to R2 CDN
- `NODE_ENV` - Set to `production`

## Troubleshooting

### Build fails
- Check `npm run build` works locally
- Verify `next.config.js` has `output: 'export'`
- Check logs in Actions tab

### Deployment fails
- Verify Cloudflare secrets are correct
- Check Cloudflare API token has Pages permission
- Ensure project name matches in workflow

### Pages says "No builds"
- Run build manually: `npm run build`
- Check `out/` directory exists
- Verify workflow triggered correctly

## Monitoring

### Build Times
Check workflow logs to see build duration. Aim for < 2 minutes.

### Deployment Success
Green checkmarks in:
- **Actions** tab - workflow succeeded
- **Deployments** tab - deployment active

### Rollback
If deployment fails:
1. Fix the issue in code
2. Commit to main
3. Automatic redeployment runs

## Advanced

### Disable Auto-Deploy
Edit `deploy.yml` and change:
```yaml
if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

### Add Notifications
Extend workflows to notify Slack/Discord on deploy.

### Custom Domain
Update Cloudflare Pages settings to use custom domain.

## Cost

- **GitHub Actions**: Free for public repos, 2000 minutes/month for private
- **Cloudflare Pages**: Free tier includes unlimited deployments
- **Build time**: ~30-60 seconds per deployment

## Support

For workflow issues:
1. Check GitHub Actions documentation
2. Review workflow logs
3. Verify secrets are configured
4. Test build locally: `npm run build`
