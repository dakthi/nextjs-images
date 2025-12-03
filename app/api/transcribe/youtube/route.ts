import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://transcribe.chartedconsultants.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get job_id from query parameters
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('job_id');

    // Build URL with optional job_id parameter
    const url = jobId
      ? `${API_BASE}/youtube/download?job_id=${jobId}`
      : `${API_BASE}/youtube/download`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('YouTube transcription API error:', error);
    return NextResponse.json(
      { error: 'Failed to process YouTube video' },
      { status: 500 }
    );
  }
}
