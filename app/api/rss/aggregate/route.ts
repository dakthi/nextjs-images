import { NextRequest, NextResponse } from 'next/server';

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
}

export async function POST(request: NextRequest) {
  try {
    const { feeds } = await request.json();

    if (!feeds || feeds.length === 0) {
      return NextResponse.json({ items: [] });
    }

    // Fetch all RSS feeds in parallel
    const fetchPromises = feeds.map(async (feed: any) => {
      try {
        const response = await fetch(feed.url, {
          headers: {
            'User-Agent': 'VL-London-News-Aggregator/1.0',
          },
          next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
          console.error(`Failed to fetch ${feed.url}: ${response.status}`);
          return [];
        }

        const xmlText = await response.text();
        const items = parseRSS(xmlText, feed.source);
        return items;
      } catch (error) {
        console.error(`Error fetching ${feed.url}:`, error);
        return [];
      }
    });

    const results = await Promise.all(fetchPromises);
    const allItems = results.flat();

    // Sort by date (newest first)
    allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return NextResponse.json({ items: allItems });
  } catch (error) {
    console.error('Failed to aggregate RSS feeds:', error);
    return NextResponse.json(
      { error: 'Failed to aggregate RSS feeds' },
      { status: 500 }
    );
  }
}

function parseRSS(xmlText: string, source: string): FeedItem[] {
  const items: FeedItem[] = [];

  try {
    // Simple regex-based parsing (good enough for most RSS feeds)
    const itemMatches = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/gi);

    if (!itemMatches) return items;

    for (const itemXml of itemMatches) {
      const title = extractTag(itemXml, 'title');
      const link = extractTag(itemXml, 'link');
      const pubDate = extractTag(itemXml, 'pubDate');
      const description = extractTag(itemXml, 'description');

      if (title && link) {
        items.push({
          title: cleanText(title),
          link: cleanText(link),
          pubDate: pubDate || new Date().toISOString(),
          description: cleanText(description || ''),
          source,
        });
      }
    }
  } catch (error) {
    console.error('Error parsing RSS:', error);
  }

  return items;
}

function extractTag(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1] : '';
}

function cleanText(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') // Remove CDATA
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}
