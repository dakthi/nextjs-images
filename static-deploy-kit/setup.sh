#!/bin/bash

# Static Deploy Kit - Setup Script
# Generates deployment files for static Next.js applications on Cloudflare Pages

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Static Deploy Kit Setup ===${NC}\n"

# Check if config file exists
if [ ! -f "project.config" ]; then
    echo -e "${RED}Error: project.config not found${NC}"
    echo "Please create project.config from project.config.template"
    exit 1
fi

# Source the config file
source project.config

# Validate required variables
if [ -z "$PROJECT_NAME" ] || [ -z "$DOMAIN" ] || [ -z "$R2_BUCKET_NAME" ] || [ -z "$R2_PUBLIC_URL" ]; then
    echo -e "${RED}Error: Missing required variables in project.config${NC}"
    echo "Required: PROJECT_NAME, DOMAIN, R2_BUCKET_NAME, R2_PUBLIC_URL"
    exit 1
fi

# Create project directory
PROJECT_DIR="$PROJECT_NAME"
mkdir -p "$PROJECT_DIR"

echo -e "${YELLOW}Generating deployment files for: ${GREEN}$PROJECT_NAME${NC}\n"

# Pre-configured values
R2_ACCOUNT_ID="f47d23c072e7b2f871ecca11e36e0b25"
R2_ACCESS_KEY_ID="1b6772892999957d50aede7703a8627e"
R2_SECRET_ACCESS_KEY="52279ce0e5fa54e88a5f73bb82365d0d1351316f3e9f2deb3b445db812202037"
CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-}"
R2_REGION="auto"
BUILD_DIR="out"

# Generate .env file
ENV_FILE="$PROJECT_DIR/.env.$PROJECT_NAME"
cat > "$ENV_FILE" << EOF
# Cloudflare R2 Configuration
R2_ACCOUNT_ID="$R2_ACCOUNT_ID"
R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
R2_BUCKET_NAME="$R2_BUCKET_NAME"
R2_PUBLIC_URL="$R2_PUBLIC_URL"
R2_ENDPOINT="https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com"
R2_REGION="$R2_REGION"

# Cloudflare Pages
CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN"

# Site Configuration
PROJECT_NAME="$PROJECT_NAME"
DOMAIN="$DOMAIN"
EOF

echo -e "${GREEN}✓ Created${NC} $ENV_FILE"

# Generate wrangler.toml file
WRANGLER_FILE="$PROJECT_DIR/wrangler.toml"
cat > "$WRANGLER_FILE" << 'WRANGLER_EOF'
name = "PROJECT_NAME_PLACEHOLDER"
type = "javascript"
main = "src/index.js"
compatibility_date = "2024-01-01"

# Build configuration
[build]
command = "npm run build"
cwd = "../../"  # Relative to the deploy folder
watch_paths = []

# Environment configuration
[env.production]
name = "PROJECT_NAME_PLACEHOLDER"

# R2 binding for image storage
[[r2_buckets]]
binding = "IMAGES"
bucket_name = "R2_BUCKET_NAME_PLACEHOLDER"
jurisdiction = "eu"

[vars]
DOMAIN = "DOMAIN_PLACEHOLDER"
R2_PUBLIC_URL = "R2_PUBLIC_URL_PLACEHOLDER"
R2_REGION = "auto"
WRANGLER_EOF

# Replace placeholders in wrangler.toml
sed -i '' "s/PROJECT_NAME_PLACEHOLDER/$PROJECT_NAME/g" "$WRANGLER_FILE"
sed -i '' "s/R2_BUCKET_NAME_PLACEHOLDER/$R2_BUCKET_NAME/g" "$WRANGLER_FILE"
sed -i '' "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" "$WRANGLER_FILE"
sed -i '' "s|R2_PUBLIC_URL_PLACEHOLDER|$R2_PUBLIC_URL|g" "$WRANGLER_FILE"

echo -e "${GREEN}✓ Created${NC} $WRANGLER_FILE"

# Generate deploy script
DEPLOY_SCRIPT="$PROJECT_DIR/deploy-$PROJECT_NAME.sh"
cat > "$DEPLOY_SCRIPT" << 'DEPLOY_EOF'
#!/bin/bash

# Static deployment script for Cloudflare Pages
# Deploys pre-built static assets

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="PROJECT_NAME_PLACEHOLDER"
DOMAIN="DOMAIN_PLACEHOLDER"
BUILD_DIR="../../out"

echo -e "${BLUE}=== Deploying $PROJECT_NAME ===${NC}\n"

# Check if build exists
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}Error: Build directory not found: $BUILD_DIR${NC}"
    echo "Run 'npm run build' first to generate static files"
    exit 1
fi

echo -e "${YELLOW}📦 Build directory found${NC}"
echo -e "   Path: $BUILD_DIR"
echo -e "   Files: $(find $BUILD_DIR -type f | wc -l)"

# Check environment file
if [ ! -f ".env.$PROJECT_NAME" ]; then
    echo -e "${RED}Error: .env.$PROJECT_NAME not found${NC}"
    exit 1
fi

# Source environment
source ".env.$PROJECT_NAME"

echo -e "${YELLOW}🔐 Environment loaded${NC}"
echo -e "   R2 Bucket: $R2_BUCKET_NAME"
echo -e "   Domain: $DOMAIN"
echo -e "   CDN URL: $R2_PUBLIC_URL"

# Deploy to Cloudflare Pages
echo -e "\n${YELLOW}📤 Deploying to Cloudflare Pages...${NC}"

if command -v wrangler &> /dev/null; then
    wrangler pages deploy $BUILD_DIR
    DEPLOY_STATUS=$?
else
    echo -e "${RED}Error: wrangler CLI not found${NC}"
    echo "Install with: npm install -g wrangler"
    exit 1
fi

if [ $DEPLOY_STATUS -eq 0 ]; then
    echo -e "\n${GREEN}✅ Deployment successful!${NC}\n"
    echo -e "${BLUE}📍 Site Information:${NC}"
    echo -e "   Domain: $DOMAIN"
    echo -e "   CDN: $R2_PUBLIC_URL"
    echo -e "   Build Directory: $BUILD_DIR"
    echo -e "\n${BLUE}ℹ️  Next steps:${NC}"
    echo -e "   • Check deployment status: wrangler pages deployments list"
    echo -e "   • View logs: wrangler tail"
    echo -e "   • Test: Visit $DOMAIN in your browser"
else
    echo -e "\n${RED}❌ Deployment failed${NC}"
    exit 1
fi
DEPLOY_EOF

# Replace placeholders in deploy script
sed -i '' "s/PROJECT_NAME_PLACEHOLDER/$PROJECT_NAME/g" "$DEPLOY_SCRIPT"
sed -i '' "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" "$DEPLOY_SCRIPT"

# Make deploy script executable
chmod +x "$DEPLOY_SCRIPT"

echo -e "${GREEN}✓ Created${NC} $DEPLOY_SCRIPT"

# Summary
echo -e "\n${GREEN}=== Setup Complete ===${NC}\n"
echo -e "${BLUE}Generated files in: ${GREEN}$PROJECT_DIR/${NC}\n"
echo -e "Files created:"
echo -e "  1. ${YELLOW}.env.$PROJECT_NAME${NC} - Environment variables"
echo -e "  2. ${YELLOW}wrangler.toml${NC} - Cloudflare Pages configuration"
echo -e "  3. ${YELLOW}deploy-$PROJECT_NAME.sh${NC} - Deployment script"

echo -e "\n${BLUE}Next steps:${NC}"
echo -e "  1. Build static files: ${YELLOW}npm run build${NC}"
echo -e "  2. Deploy to Cloudflare: ${YELLOW}cd $PROJECT_DIR && ./deploy-$PROJECT_NAME.sh${NC}"

echo ""
