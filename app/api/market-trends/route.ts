import { NextResponse } from 'next/server';

// Mock data for market trends
const marketTrendsData = {
  topPerformingSectors: [
    { sector: 'Technology', oneDay: 1.2, oneWeek: 3.5, oneMonth: 5.8, threeMonths: 12.3, ytd: 15.7, oneYear: 28.4 },
    { sector: 'Healthcare', oneDay: 0.8, oneWeek: 2.1, oneMonth: 4.2, threeMonths: 9.5, ytd: 11.2, oneYear: 18.9 },
    { sector: 'Consumer Discretionary', oneDay: 0.6, oneWeek: 1.9, oneMonth: 3.7, threeMonths: 8.1, ytd: 10.5, oneYear: 16.2 },
  ],
  bottomPerformingSectors: [
    { sector: 'Energy', oneDay: -0.7, oneWeek: -2.1, oneMonth: -3.5, threeMonths: -7.2, ytd: -9.8, oneYear: -12.4 },
    { sector: 'Utilities', oneDay: -0.5, oneWeek: -1.8, oneMonth: -2.9, threeMonths: -5.6, ytd: -7.2, oneYear: -9.8 },
    { sector: 'Real Estate', oneDay: -0.3, oneWeek: -1.2, oneMonth: -2.1, threeMonths: -4.3, ytd: -5.9, oneYear: -8.2 },
  ],
  marketIndices: [
    { name: 'S&P 500', current: 4782.82, change: 35.21, percentChange: 0.74 },
    { name: 'Dow Jones', current: 38150.30, change: 368.95, percentChange: 0.97 },
    { name: 'NASDAQ', current: 15628.04, change: 125.45, percentChange: 0.81 },
    { name: 'Russell 2000', current: 2018.56, change: 12.75, percentChange: 0.63 },
  ],
  marketVolatility: [
    { date: '2023-01', value: 18.5 },
    { date: '2023-02', value: 17.2 },
    { date: '2023-03', value: 19.8 },
    { date: '2023-04', value: 16.3 },
    { date: '2023-05', value: 15.9 },
    { date: '2023-06', value: 14.7 },
    { date: '2023-07', value: 13.8 },
    { date: '2023-08', value: 15.2 },
    { date: '2023-09', value: 16.8 },
    { date: '2023-10', value: 18.1 },
    { date: '2023-11', value: 16.5 },
    { date: '2023-12', value: 15.3 },
  ],
  sectorRotation: [
    { sector: 'Technology', momentum: 0.85 },
    { sector: 'Healthcare', momentum: 0.72 },
    { sector: 'Financials', momentum: 0.65 },
    { sector: 'Consumer Discretionary', momentum: 0.58 },
    { sector: 'Communication Services', momentum: 0.52 },
    { sector: 'Industrials', momentum: 0.48 },
    { sector: 'Materials', momentum: 0.42 },
    { sector: 'Consumer Staples', momentum: 0.38 },
    { sector: 'Real Estate', momentum: 0.32 },
    { sector: 'Utilities', momentum: 0.25 },
    { sector: 'Energy', momentum: 0.18 },
  ]
};

export async function GET() {
  try {
    // In a real application, you would fetch this data from a database or external API
    // For now, we'll return mock data
    
    return NextResponse.json(marketTrendsData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error in market-trends API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market trends data' },
      { status: 500 }
    );
  }
} 