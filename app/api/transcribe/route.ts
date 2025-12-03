import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://transcribe.chartedconsultants.com';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Get job_id from query parameters
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('job_id');

    // Build URL with optional job_id parameter
    const url = jobId
      ? `${API_BASE}/transcribe?job_id=${jobId}`
      : `${API_BASE}/transcribe`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Transcription API error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe file' },
      { status: 500 }
    );
  }
}
