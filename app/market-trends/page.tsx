"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Link from 'next/link';

interface MarketTrend {
  sector: string;
  performance: number;
  volume: number;
  volatility: number;
}

interface SectorPerformance {
  sector: string;
  oneDay: number;
  oneWeek: number;
  oneMonth: number;
  threeMonths: number;
  ytd: number;
  oneYear: number;
}

interface MarketTrendsData {
  topPerformingSectors: SectorPerformance[];
  bottomPerformingSectors: SectorPerformance[];
  marketIndices: {
    name: string;
    current: number;
    change: number;
    percentChange: number;
  }[];
  marketVolatility: {
    date: string;
    value: number;
  }[];
  sectorRotation: {
    sector: string;
    momentum: number;
  }[];
}

export default function MarketTrendsPage() {
  const [marketTrendsData, setMarketTrendsData] = useState<MarketTrendsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketTrends = async () => {
      setLoading(true);
      try {
        // This would be replaced with your actual API endpoint
        const response = await axios.get('/api/market-trends');
        setMarketTrendsData(response.data);
      } catch (err) {
        console.error('Error fetching market trends:', err);
        setError('Failed to load market trends data');
        
        // For demo purposes, set mock data
        setMarketTrendsData({
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
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMarketTrends();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-sky-400">Market Trends Analysis</h1>
          <div className="flex space-x-2">
            <Link href="/predict" className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md transition-colors">
              Back to Predictions
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-md">
            {error}
          </div>
        ) : marketTrendsData ? (
          <div className="space-y-8">
            {/* Market Indices */}
            <div className="bg-white/10 rounded-lg p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-sky-400 mb-4">Market Indices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {marketTrendsData.marketIndices.map((index) => (
                  <div key={index.name} className="bg-white/5 p-4 rounded-md">
                    <h3 className="text-lg font-medium">{index.name}</h3>
                    <div className="text-2xl font-bold">{index.current.toLocaleString()}</div>
                    <div className={`flex items-center ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <span>{index.change >= 0 ? '▲' : '▼'}</span>
                      <span className="ml-1">{Math.abs(index.change).toLocaleString()}</span>
                      <span className="ml-1">({index.percentChange.toFixed(2)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Sectors */}
            <div className="bg-white/10 rounded-lg p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-sky-400 mb-4">Top Performing Sectors</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white/5 rounded-md">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-3 px-4 text-left">Sector</th>
                      <th className="py-3 px-4 text-right">1 Day</th>
                      <th className="py-3 px-4 text-right">1 Week</th>
                      <th className="py-3 px-4 text-right">1 Month</th>
                      <th className="py-3 px-4 text-right">3 Months</th>
                      <th className="py-3 px-4 text-right">YTD</th>
                      <th className="py-3 px-4 text-right">1 Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketTrendsData.topPerformingSectors.map((sector) => (
                      <tr key={sector.sector} className="border-b border-white/10 hover:bg-white/10">
                        <td className="py-3 px-4">{sector.sector}</td>
                        <td className={`py-3 px-4 text-right ${sector.oneDay >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {sector.oneDay.toFixed(2)}%
                        </td>
                        <td className={`py-3 px-4 text-right ${sector.oneWeek >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {sector.oneWeek.toFixed(2)}%
                        </td>
                        <td className={`py-3 px-4 text-right ${sector.oneMonth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {sector.oneMonth.toFixed(2)}%
                        </td>
                        <td className={`py-3 px-4 text-right ${sector.threeMonths >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {sector.threeMonths.toFixed(2)}%
                        </td>
                        <td className={`py-3 px-4 text-right ${sector.ytd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {sector.ytd.toFixed(2)}%
                        </td>
                        <td className={`py-3 px-4 text-right ${sector.oneYear >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {sector.oneYear.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Performing Sectors */}
            <div className="bg-white/10 rounded-lg p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-sky-400 mb-4">Bottom Performing Sectors</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white/5 rounded-md">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-3 px-4 text-left">Sector</th>
                      <th className="py-3 px-4 text-right">1 Day</th>
                      <th className="py-3 px-4 text-right">1 Week</th>
                      <th className="py-3 px-4 text-right">1 Month</th>
                      <th className="py-3 px-4 text-right">3 Months</th>
                      <th className="py-3 px-4 text-right">YTD</th>
                      <th className="py-3 px-4 text-right">1 Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketTrendsData.bottomPerformingSectors.map((sector) => (
                      <tr key={sector.sector} className="border-b border-white/10 hover:bg-white/10">
                        <td className="py-3 px-4">{sector.sector}</td>
                        <td className={`py-3 px-4 text-right ${sector.oneDay >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {sector.oneDay.toFixed(2)}%
                        </td>
                        <td className={`py-3 px-4 text-right ${sector.oneWeek >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {sector.oneWeek.toFixed(2)}%
                        </td>
                        <td className={`py-3 px-4 text-right ${sector.oneMonth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {sector.oneMonth.toFixed(2)}%
                        </td>
                        <td className={`py-3 px-4 text-right ${sector.threeMonths >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {sector.threeMonths.toFixed(2)}%
                        </td>
                        <td className={`py-3 px-4 text-right ${sector.ytd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {sector.ytd.toFixed(2)}%
                        </td>
                        <td className={`py-3 px-4 text-right ${sector.oneYear >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {sector.oneYear.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Market Volatility Chart */}
            <div className="bg-white/10 rounded-lg p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-sky-400 mb-4">Market Volatility (VIX)</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={marketTrendsData.marketVolatility}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sector Rotation/Momentum */}
            <div className="bg-white/10 rounded-lg p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-sky-400 mb-4">Sector Momentum</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={marketTrendsData.sectorRotation}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis type="number" domain={[0, 1]} stroke="#888" />
                    <YAxis dataKey="sector" type="category" stroke="#888" width={90} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                      labelStyle={{ color: '#fff' }}
                      formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Momentum']}
                    />
                    <Bar dataKey="momentum" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
} 