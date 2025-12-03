import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import https from 'https';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  // Add retry configuration for SSL/network issues
  maxAttempts: 3,
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 30000,
    requestTimeout: 60000,
    httpsAgent: new https.Agent({
      keepAlive: true,
      maxSockets: 50,
      // Allow legacy TLS versions for R2 compatibility with Node.js v23
      minVersion: 'TLSv1.2',
      secureOptions: 0, // Allow all cipher suites
    }),
  }),
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'vl-london-images';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const description = formData.get('description') as string;
    const artist = formData.get('artist') as string;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = image.name.split('.').pop();
    const filename = `nail-portfolio/${artist}/${timestamp}-${randomString}.${extension}`;

    // Convert file to buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: image.type,
      Metadata: {
        artist,
        description,
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(command);

    // Generate public URL
    const imageUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      filename,
      artist,
      description,
    });
  } catch (error) {
    console.error('Upload error:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to upload image';
    if (error instanceof Error) {
      if (error.message.includes('EPROTO') || error.message.includes('SSL')) {
        errorMessage = 'SSL/Network error connecting to storage. Please try again.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Upload timeout. Please check your connection and try again.';
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
