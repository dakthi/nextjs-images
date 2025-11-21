'use client';

import { useEffect, useRef } from 'react';
import MainLayout from '../components/MainLayout';

declare global {
  interface Window {
    SwaggerUIBundle?: any;
    SwaggerUIStandalonePreset?: any;
  }
}

export default function APIDocs() {
  const swaggerUIRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.js';
    script1.async = true;

    const script2 = document.createElement('script');
    script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js';
    script2.async = true;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css';

    const themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css';

    document.head.appendChild(link);
    document.head.appendChild(themeLink);

    const loadSwagger = () => {
      if (window.SwaggerUIBundle && swaggerUIRef.current) {
        const ui = window.SwaggerUIBundle({
          url: '/api-docs.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            window.SwaggerUIBundle.presets.apis,
            window.SwaggerUIStandalonePreset,
          ],
          plugins: [window.SwaggerUIBundle.plugins.DownloadUrl],
          layout: 'BaseLayout',
          defaultModelsExpandDepth: 1,
          docExpansion: 'list',
          filter: true,
          requestInterceptor: (request: any) => {
            request.headers['X-Swagger-UI'] = 'true';
            return request;
          },
        });

        (window as any).ui = ui;
      }
    };

    let scriptsLoaded = 0;
    const checkLoadComplete = () => {
      scriptsLoaded++;
      if (scriptsLoaded === 2) {
        setTimeout(loadSwagger, 100);
      }
    };

    script1.onload = checkLoadComplete;
    script2.onload = checkLoadComplete;

    document.body.appendChild(script1);
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">API Documentation</h1>
        <p className="text-xl text-black font-semibold">
          Complete OpenAPI/Swagger specification for VL London Product Management API
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md border-2 border-gray-300 p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-black mb-3">Getting Started</h2>
          <div className="space-y-3 text-black">
            <p className="font-medium">
              Base URL: <code className="bg-gray-100 px-2 py-1 rounded">/api</code>
            </p>
            <p>
              The VL London Product Management API provides endpoints for managing products, brands,
              images, pricing, versions, and more. All endpoints are RESTful and return JSON responses.
            </p>
            <p className="font-medium mt-4">Authentication:</p>
            <p>
              Currently using header-based authentication. Include your credentials in request headers
              for protected endpoints.
            </p>
            <p className="font-medium mt-4">Rate Limiting:</p>
            <p>
              Standard API rate limits apply. Requests are processed sequentially with appropriate
              timeouts for file uploads and bulk operations.
            </p>
          </div>
        </div>

        <div className="border-t-2 border-gray-300 pt-6 mt-6">
          <h2 className="text-2xl font-bold text-black mb-4">API Endpoints</h2>
          <div
            id="swagger-ui"
            ref={swaggerUIRef}
            className="swagger-ui"
          ></div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg shadow-md border-2 border-blue-300 p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-3">Common Response Codes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-green-700 font-bold">200 OK</p>
            <p className="text-black">Request succeeded, resource returned</p>
          </div>
          <div className="space-y-2">
            <p className="text-green-700 font-bold">201 Created</p>
            <p className="text-black">Resource created successfully</p>
          </div>
          <div className="space-y-2">
            <p className="text-yellow-700 font-bold">207 Multi-Status</p>
            <p className="text-black">Partial success (batch operations)</p>
          </div>
          <div className="space-y-2">
            <p className="text-red-700 font-bold">400 Bad Request</p>
            <p className="text-black">Invalid request parameters</p>
          </div>
          <div className="space-y-2">
            <p className="text-red-700 font-bold">404 Not Found</p>
            <p className="text-black">Resource not found</p>
          </div>
          <div className="space-y-2">
            <p className="text-red-700 font-bold">500 Server Error</p>
            <p className="text-black">Internal server error occurred</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-green-50 rounded-lg shadow-md border-2 border-green-300 p-6">
        <h2 className="text-xl font-bold text-green-900 mb-3">Key Features</h2>
        <ul className="space-y-2 text-black">
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>Full product lifecycle management (CRUD operations)</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>Product versioning with comparison and rollback</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>Multi-format content (descriptions, images, pricing)</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>Brand management and product categorization</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>File upload to Cloudflare R2 with retry logic</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>Bulk CSV import for products</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>Multi-format export (JSON, CSV, ZIP)</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>Search and filtering capabilities</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>Audit logging for all changes</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>Flexible property system for custom attributes</span>
          </li>
        </ul>
      </div>

      <div className="mt-8 bg-purple-50 rounded-lg shadow-md border-2 border-purple-300 p-6">
        <h2 className="text-xl font-bold text-purple-900 mb-3">Environment Variables Required</h2>
        <div className="bg-white p-4 rounded border-2 border-purple-300 font-mono text-sm space-y-2 text-black">
          <p>DATABASE_URL=postgresql://...</p>
          <p>R2_ACCESS_KEY_ID=your-r2-access-key</p>
          <p>R2_SECRET_ACCESS_KEY=your-r2-secret-key</p>
          <p>R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com/</p>
          <p>R2_BUCKET_NAME=your-bucket-name</p>
          <p>R2_PUBLIC_URL=https://your-public-r2-url.com</p>
        </div>
      </div>
    </MainLayout>
  );
}
