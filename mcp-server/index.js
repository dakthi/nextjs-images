#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create MCP server
const server = new Server(
  {
    name: 'vllondon-db',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool: List all products
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_products',
        description: 'List all products with their basic information',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Maximum number of products to return (default: 50)',
            },
          },
        },
      },
      {
        name: 'get_product_details',
        description: 'Get detailed information about a specific product including images and content',
        inputSchema: {
          type: 'object',
          properties: {
            product_id: {
              type: 'string',
              description: 'The product ID',
            },
          },
          required: ['product_id'],
        },
      },
      {
        name: 'get_product_images',
        description: 'Get all images for a product version',
        inputSchema: {
          type: 'object',
          properties: {
            version_id: {
              type: 'string',
              description: 'The version ID of the product',
            },
          },
          required: ['version_id'],
        },
      },
      {
        name: 'get_product_content',
        description: 'Get content (captions, descriptions) for a product',
        inputSchema: {
          type: 'object',
          properties: {
            version_id: {
              type: 'string',
              description: 'The version ID of the product',
            },
            content_type: {
              type: 'string',
              description: 'Type of content (short_description, long_description, technical_specifications, usage_instructions)',
            },
          },
          required: ['version_id'],
        },
      },
      {
        name: 'export_posts_with_images',
        description: 'Export all products with their captions and images grouped together',
        inputSchema: {
          type: 'object',
          properties: {
            brand_id: {
              type: 'string',
              description: 'Optional: Filter by brand ID',
            },
          },
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_products': {
        const limit = args.limit || 50;
        const result = await pool.query(
          `SELECT p.id, p.name, p.brand_id, b.name as brand_name, pv.id as version_id
           FROM products p
           LEFT JOIN brands b ON p.brand_id = b.id
           LEFT JOIN product_versions pv ON p.id = pv.product_id AND pv.is_published = true
           ORDER BY p.created_at DESC
           LIMIT $1`,
          [limit]
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.rows, null, 2),
            },
          ],
        };
      }

      case 'get_product_details': {
        const { product_id } = args;
        const result = await pool.query(
          `SELECT
            p.*,
            b.name as brand_name,
            pv.id as version_id,
            pv.version_number,
            json_agg(DISTINCT jsonb_build_object(
              'content_type', pc.content_type,
              'content', pc.content,
              'language', pc.language
            )) as content,
            json_agg(DISTINCT jsonb_build_object(
              'image_url', pi.image_url,
              'image_type', pi.image_type,
              'position', pi.position,
              'display_order', pi.display_order
            ) ORDER BY pi.display_order) as images
           FROM products p
           LEFT JOIN brands b ON p.brand_id = b.id
           LEFT JOIN product_versions pv ON p.id = pv.product_id AND pv.is_published = true
           LEFT JOIN product_content pc ON pv.id = pc.version_id
           LEFT JOIN product_images pi ON pv.id = pi.version_id
           WHERE p.id = $1
           GROUP BY p.id, b.name, pv.id, pv.version_number`,
          [product_id]
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.rows[0] || {}, null, 2),
            },
          ],
        };
      }

      case 'get_product_images': {
        const { version_id } = args;
        const result = await pool.query(
          `SELECT * FROM product_images
           WHERE version_id = $1
           ORDER BY display_order`,
          [version_id]
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.rows, null, 2),
            },
          ],
        };
      }

      case 'get_product_content': {
        const { version_id, content_type } = args;
        let query = 'SELECT * FROM product_content WHERE version_id = $1';
        const params = [version_id];

        if (content_type) {
          query += ' AND content_type = $2';
          params.push(content_type);
        }

        const result = await pool.query(query, params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.rows, null, 2),
            },
          ],
        };
      }

      case 'export_posts_with_images': {
        let query = `
          SELECT
            p.id as product_id,
            p.name as product_name,
            b.name as brand_name,
            pv.id as version_id,
            pc.content_type,
            pc.content,
            json_agg(jsonb_build_object(
              'image_url', pi.image_url,
              'image_type', pi.image_type,
              'position', pi.position,
              'display_order', pi.display_order
            ) ORDER BY pi.display_order) as images
          FROM products p
          LEFT JOIN brands b ON p.brand_id = b.id
          LEFT JOIN product_versions pv ON p.id = pv.product_id AND pv.is_published = true
          LEFT JOIN product_content pc ON pv.id = pc.version_id
          LEFT JOIN product_images pi ON pv.id = pi.version_id
        `;

        const params = [];
        if (args.brand_id) {
          query += ' WHERE p.brand_id = $1';
          params.push(args.brand_id);
        }

        query += ' GROUP BY p.id, p.name, b.name, pv.id, pc.content_type, pc.content';

        const result = await pool.query(query, params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.rows, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('VL London MCP server running on stdio');
}

main().catch(console.error);
