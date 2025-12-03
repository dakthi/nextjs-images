import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import https from 'https';

export const maxDuration = 60;
export const runtime = 'nodejs';

// Validate R2 credentials on startup
if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_ENDPOINT) {
  console.error('R2 credentials are missing. Please configure R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_ENDPOINT');
}

const s3Client = new S3Client({
  region: process.env.R2_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true,
  requestHandler: {
    httpsAgent: new https.Agent({
      keepAlive: true,
      maxSockets: 50,
      // Allow legacy TLS versions for R2 compatibility with Node.js v23
      minVersion: 'TLSv1.2',
      secureOptions: 0, // Allow all cipher suites
    }),
  },
});

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function uploadWithRetry(command: PutObjectCommand, attempt = 0): Promise<void> {
  try {
    await s3Client.send(command);
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      console.warn(`Upload attempt ${attempt + 1} failed. Retrying in ${RETRY_DELAY_MS}ms...`, error);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)));
      return uploadWithRetry(command, attempt + 1);
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];
    const folder = (formData.get('folder') as string) || 'product-images';
    const isBatch = formData.get('batch') === 'true';

    // Handle single file or batch upload
    if (!isBatch && files.length === 1) {
      return handleSingleFileUpload(files[0], folder);
    } else if (isBatch && files.length > 0) {
      return handleBatchUpload(files, folder);
    } else {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Upload error:', errorMessage, error);

    // Provide helpful error messages
    let userMessage = 'Failed to upload file';
    if (errorMessage.includes('NoSuchBucket')) {
      userMessage = 'R2 bucket not found. Check bucket configuration.';
    } else if (errorMessage.includes('InvalidAccessKeyId')) {
      userMessage = 'Invalid R2 access credentials.';
    } else if (errorMessage.includes('AccessDenied')) {
      userMessage = 'Access denied to R2 bucket.';
    } else if (errorMessage.includes('ECONNREFUSED')) {
      userMessage = 'Cannot connect to R2 storage. Check endpoint URL.';
    }

    return NextResponse.json(
      { error: userMessage, details: process.env.NODE_ENV === 'development' ? errorMessage : undefined },
      { status: 500 }
    );
  }
}

async function handleSingleFileUpload(file: File, folder: string) {
  // Validation
  const validation = validateFile(file);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { filename, key } = generateFileKey(file, folder);

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || 'bucket-vllondon',
    Key: key,
    Body: buffer,
    ContentType: file.type,
    CacheControl: 'public, max-age=31536000',
  });

  await uploadWithRetry(command);
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  return NextResponse.json(
    {
      success: true,
      url: publicUrl,
      filename: filename,
    },
    { status: 201 }
  );
}

async function handleBatchUpload(files: File[], folder: string) {
  const results = [];
  const errors = [];

  for (const file of files) {
    try {
      const validation = validateFile(file);
      if (!validation.valid) {
        errors.push({ filename: file.name, error: validation.error });
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const { filename, key } = generateFileKey(file, folder);

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME || 'bucket-vllondon',
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: 'public, max-age=31536000',
      });

      await uploadWithRetry(command);
      const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

      results.push({
        success: true,
        originalName: file.name,
        filename: filename,
        url: publicUrl,
      });
    } catch (error) {
      errors.push({
        filename: file.name,
        error: error instanceof Error ? error.message : 'Upload failed',
      });
    }
  }

  return NextResponse.json(
    {
      success: results.length > 0,
      uploaded: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    },
    { status: errors.length === 0 ? 201 : 207 }
  );
}

function validateFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type for ${file.name}. Allowed: JPG, PNG, GIF, WebP` };
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: `File ${file.name} is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum 10MB allowed.` };
  }

  return { valid: true };
}

function generateFileKey(file: File, folder: string): { filename: string; key: string } {
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  const cleanFilename = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .split('.')[0]
    .substring(0, 30); // Limit to 30 chars
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${timestamp}-${uniqueId}-${cleanFilename}.${ext}`;
  const key = `${folder}/${filename}`;

  return { filename, key };
}
