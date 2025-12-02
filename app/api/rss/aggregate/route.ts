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

    // Filter out irrelevant articles
    const filteredItems = allItems.filter(item => isRelevantForSalonOwners(item));

    // Sort by date (newest first)
    filteredItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return NextResponse.json({ items: filteredItems });
  } catch (error) {
    console.error('Failed to aggregate RSS feeds:', error);
    return NextResponse.json(
      { error: 'Failed to aggregate RSS feeds' },
      { status: 500 }
    );
  }
}

function isRelevantForSalonOwners(item: FeedItem): boolean {
  const text = `${item.title} ${item.description}`.toLowerCase();

  // Irrelevant topics to filter out (politics, celebrities, sports, entertainment)
  const irrelevantKeywords = [
    // Politics & Politicians
    'trump', 'biden', 'labour party', 'conservative', 'starmer', 'sunak', 'parliament',
    'election', 'mp votes', 'political', 'congress', 'senate',

    // Celebrities & Entertainment
    'kardashian', 'celebrity', 'royal family', 'prince', 'princess', 'hollywood',
    'actor', 'actress', 'singer', 'music video', 'netflix', 'tv show', 'movie premiere',
    'red carpet', 'grammy', 'oscar', 'emmy',

    // Sports
    'football', 'premier league', 'champions league', 'world cup', 'olympics',
    'tennis', 'basketball', 'cricket', 'rugby', 'boxing', 'f1 racing',

    // Big corporations/tech (unless money/business related)
    'elon musk', 'jeff bezos', 'mark zuckerberg', 'tesla stock', 'spacex',

    // Crime/Violence (unless employment/business law)
    'murder', 'shooting', 'robbery', 'assault', 'terror attack',

    // International conflicts
    'ukraine war', 'middle east conflict', 'military strike', 'bombing',

    // Weather (unless energy/cost related)
    'weather forecast', 'temperature today', 'weekend weather'
  ];

  // Relevant topics to prioritize
  const relevantKeywords = [
    // Money & Costs
    'tax', 'vat', 'hmrc', 'paye', 'tax credit', 'business rates', 'rent increase',
    'minimum wage', 'living wage', 'salary', 'pay rise', 'energy bill', 'electricity',
    'gas bill', 'utility', 'cost saving', 'inflation', 'price increase',

    // Small Business
    'small business', 'self-employed', 'entrepreneur', 'salon', 'beauty', 'nail',
    'retail', 'shop owner', 'business owner', 'landlord', 'tenant', 'lease',
    'commercial property', 'insurance', 'license', 'permit',

    // Immigration & Work
    'visa', 'immigration', 'work permit', 'skilled worker', 'sponsor', 'right to work',
    'tier 2', 'points-based', 'settlement', 'indefinite leave',

    // Employment & HR
    'employee', 'staff', 'hiring', 'payroll', 'pension', 'holiday pay', 'sick pay',
    'maternity', 'redundancy', 'dismissal', 'tribunal', 'contract',

    // Finance & Banking
    'loan', 'mortgage', 'credit', 'bank account', 'interest rate', 'savings',
    'payment', 'invoice', 'grant', 'funding'
  ];

  // Check if any irrelevant keyword is present
  const hasIrrelevantContent = irrelevantKeywords.some(keyword => text.includes(keyword));
  if (hasIrrelevantContent) {
    return false;
  }

  // If from specialized feeds (salon/beauty), always include
  if (item.source.toLowerCase().includes('beauty') ||
      item.source.toLowerCase().includes('nail') ||
      item.source.toLowerCase().includes('scratch')) {
    return true;
  }

  // For general news feeds, check if it has relevant keywords
  const hasRelevantContent = relevantKeywords.some(keyword => text.includes(keyword));

  return hasRelevantContent;
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
