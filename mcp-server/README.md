# VL London MCP Server

MCP (Model Context Protocol) server for safe interaction with the VL London database.

## Features

- **list_products** - List all products with basic information
- **get_product_details** - Get detailed product info including images and content
- **get_product_images** - Get all images for a product version
- **get_product_content** - Get captions and descriptions for a product
- **export_posts_with_images** - Export all products with grouped images

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Claude Code to use this MCP server:

Add to your Claude Code MCP settings (`~/.config/claude-code/mcp.json` or via Claude Code settings):

```json
{
  "mcpServers": {
    "vllondon-db": {
      "command": "node",
      "args": ["/Users/dakthi/Documents/Factory-Tech/nextjs/vl-london/mcp-server/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://vllondon_user:vLLondon2025@127.0.0.1:5555/vllondon_db?schema=public"
      }
    }
  }
}
```

3. Restart Claude Code

## Usage

Once configured, you can use these tools in Claude Code:

```
Use mcp__vllondon-db__list_products to list all products
Use mcp__vllondon-db__get_product_details with product_id to get full details
Use mcp__vllondon-db__export_posts_with_images to export all posts
```

## Database Schema

- **products** - Main product table
- **brands** - Brand information
- **product_versions** - Product versions
- **product_content** - Captions and descriptions
- **product_images** - Product images (multiple per product)
- **pricing** - Price information

## Safety

This MCP server provides read-only access to the database. All queries are pre-defined and parameterized to prevent SQL injection.
