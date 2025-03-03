"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

// Update interfaces to match API response
interface ForecastData {
  predictions: number[];
  dates?: string[]; // Adding optional dates property to fix linter errors
}

interface AssociationRule {
  antecedents: string[];
  consequents: string[];
  support: number;
  confidence: number;
  lift: number;
}

interface PredictionResults {
  forecast: ForecastData;
  associationRules: AssociationRule[];
}

// Rest of the interfaces remain the same...
interface ComprehensiveAnalysis {
  basic_info: {
    company_name: string;
    sector: string;
    industry: string;
  };
  price_metrics: {
    current_price: number;
    'fifty_two_week_high': number;
    'fifty_two_week_low': number;
  };
  financial_health: {
    market_cap: number;
    pe_ratio: number;
    dividend_yield: number;
    beta: number;
  };
  performance_analysis: {
    monthly_returns: Array<{month: string; return: number}>;
    volatility: number;
    sharpe_ratio: number;
  };
  risk_assessment: {
    volatility_category: string;
    investment_risk_level: string;
  };
  analyst_recommendations?: {
    buy: number;
    hold: number;
    sell: number;
  };
}

export default function PredictPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictionResults, setPredictionResults] = useState<PredictionResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a valid stock symbol');
      return;
    }

    setLoading(true);
    setError(null);
    setPredictionResults(null);

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      // Updated forecast API call with correct request format
      const forecastResponse = await axios.post(`${BASE_URL}/forecast`, {
        stock_symbol: searchTerm.toUpperCase(),
        forecast_horizon: 10
      }, {
        timeout: 10000
      });

      // Generate dates array for the predictions
      const dates = Array.from({ length: forecastResponse.data.predictions.length }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date.toISOString().split('T')[0];
      });

      // Format the response to match the expected structure
      const formattedForecastData = {
        forecast: {
          predictions: forecastResponse.data.predictions,
          dates: dates
        },
        associationRules: [] // Keep existing association rules handling
      };

      setPredictionResults(formattedForecastData);

      // Rest of the API calls remain the same...
      const associationResponse = await axios.post(`${BASE_URL}/stock_association`, {
        tickers: [searchTerm.toUpperCase(), "AAPL", "MSFT", "GOOG"],
        start_date: "2023-01-01",
        end_date: "2024-01-01",
        min_support: 0.2,
        min_lift: 1.0
      }, {
        timeout: 10000
      });

      const analysisResponse = await axios.post(`${BASE_URL}/comprehensive_analysis`, {
        symbol: searchTerm.toUpperCase(),
        start_date: "2023-01-01",
        end_date: "2024-01-01"
      }, {
        timeout: 10000
      });

      setPredictionResults({
        ...formattedForecastData,
        associationRules: associationResponse.data.rules
      });
      setComprehensiveAnalysis(analysisResponse.data);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(`Server Error: ${err.response.data.detail || 'Unknown error'}`);
        } else if (err.request) {
          setError('No response from server. Please check your backend connection.');
        } else {
          setError('Error setting up the request. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Transform forecast data for chart
  const chartData = predictionResults ? 
    predictionResults.forecast.dates?.map((date: string, index: number) => ({
      date, 
      price: predictionResults.forecast.predictions[index]
    })) || [] : 
    [];

  const renderCharts = () => {
    if (!isMounted || !predictionResults) return null;
    
    return (
      <div className="grid md:grid-cols-2 gap-8">
        {/* Price Forecast with Interactive Chart and Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-sky-500">
              Price Forecast
            </h2>
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-white/10 rounded-full p-1">
              <button 
                onClick={() => setViewMode('chart')}
                className={`px-4 py-1 rounded-full transition-colors ${
                  viewMode === 'chart' 
                    ? 'bg-sky-500 text-white' 
                    : 'text-gray-400 hover:bg-white/20'
                }`}
              >
                Chart
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`px-4 py-1 rounded-full transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-sky-500 text-white' 
                    : 'text-gray-400 hover:bg-white/20'
                }`}
              >
                Table
              </button>
            </div>
          </div>
          
          {/* Conditional Rendering: Chart or Table */}
          {viewMode === 'chart' ? (
            <div className="h-64 w-full relative">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="rgba(255,255,255,0.1)" 
                      verticalFill={["rgba(14, 165, 233, 0.05)", "transparent"]}
                      fillOpacity={0.1}
                    />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.5)" 
                      tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                      interval="preserveStartEnd"
                      tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                      tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)" 
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                      width={70}
                      tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                      tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                      label={{ 
                        value: 'Price ($)', 
                        angle: -90, 
                        position: 'insideLeft', 
                        fill: 'rgba(255,255,255,0.5)',
                        offset: 0,
                        style: { textAnchor: 'middle' }
                      }}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const price = Number(payload[0].value);
                          const date = new Date(label);
                          const initialPrice = Number(chartData[0]?.price || 0);
                          const percentChange = initialPrice 
                            ? ((price - initialPrice) / initialPrice * 100).toFixed(2) 
                            : '0';
                          
                          return (
                            <div className="bg-black/90 border border-sky-500/30 rounded-lg p-4 shadow-2xl max-w-[250px] w-full">
                              <p className="text-white font-bold mb-2 text-sm">
                                {date.toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <div className="flex items-center justify-between space-x-2">
                                <div className="flex items-center space-x-1">
                                  <span className="text-sky-400 font-semibold text-xs">Price:</span>
                                  <span className="text-white text-sm">${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <span className={`text-xs ${Number(percentChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  ({percentChange}%)
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                      cursor={{ stroke: 'rgba(14, 165, 233, 0.5)', strokeWidth: 2 }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.9)', 
                        border: 'none',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#0EA5E9" 
                      strokeWidth={3} 
                      dot={{ 
                        r: 5, 
                        fill: '#0EA5E9', 
                        stroke: 'white', 
                        strokeWidth: 2,
                        style: { filter: 'drop-shadow(0 0 4px rgba(14, 165, 233, 0.5))' }
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
              
              {/* Statistical Annotations */}
              {isMounted && chartData.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-white/5 p-3 rounded-b-2xl flex justify-between text-xs">
                  <div className="flex-1 text-center">
                    <span className="text-gray-400 mr-1 block">Initial Price:</span>
                    <span className="text-white">${Number(chartData[0]?.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-gray-400 mr-1 block">Final Predicted Price:</span>
                    <span className="text-white">${Number(chartData[chartData.length - 1]?.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-gray-400 mr-1 block">Price Change:</span>
                    <span className={`font-semibold ${
                      Number(chartData[chartData.length - 1]?.price || 0) >= Number(chartData[0]?.price || 0)
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>
                      {(
                        ((Number(chartData[chartData.length - 1]?.price || 0) - Number(chartData[0]?.price || 0)) / Number(chartData[0]?.price || 1) * 100)
                      ).toFixed(2)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-black/80 backdrop-blur-sm">
                  <tr className="border-b border-white/10">
                    <th className="py-2 px-4 text-gray-400">Date</th>
                    <th className="py-2 px-4 text-gray-400">Predicted Price</th>
                  </tr>
                </thead>
                <tbody>
                  {predictionResults.forecast.dates?.map((date: string, index: number) => (
                    <tr key={date} className="border-b border-white/10 last:border-b-0 hover:bg-white/10 transition-colors">
                      <td className="py-2 px-4 text-white">{date}</td>
                      <td className="py-2 px-4 text-sky-400">
                        ${predictionResults.forecast.predictions[index].toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Market Insights with Enhanced Design */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-sky-500">
              Market Insights
            </h2>
            <div className="flex items-center space-x-2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm">Stock Correlations</span>
            </div>
          </div>

          {predictionResults.associationRules.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {predictionResults.associationRules.map((rule, index) => (
                <div 
                  key={index} 
                  className="bg-white/10 rounded-lg p-4 border border-white/20 hover:border-sky-500 transition-all group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold group-hover:text-sky-400 transition-colors">
                      {rule.antecedents.join(', ')} → {rule.consequents.join(', ')}
                    </span>
                    <span className="text-sky-400 text-sm font-medium">
                      Lift: {rule.lift.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm flex justify-between">
                    <span>Support: {rule.support.toFixed(4)}</span>
                    <span>Confidence: {rule.confidence.toFixed(4)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/10 rounded-lg p-6 text-center border border-white/20">
              <p className="text-gray-400 mb-4">
                No significant market insights found for the selected stocks.
              </p>
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Try different stock combinations
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Gradient Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(0, 0, 0, 0.8) 100%)',
          opacity: 0.5
        }}
      ></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
              <span className="text-xl font-bold text-sky-500">
                <span className="text-white">Fin</span>Stock Predictions
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">
            AI-Powered <span className="text-sky-500">Stock Predictions</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Leverage advanced machine learning to forecast stock prices and uncover market insights.
          </p>
        </div>

        {/* Search Bar with Enhanced Design */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
          <div className="relative group">
            {/* Animated Gradient Border */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-black via-black to-sky-950/20 rounded-xl opacity-50 group-hover:opacity-75 group-hover:animate-pulse transition duration-300"></div>
            
            {/* Search Input Container */}
            <div className="relative flex items-center">
              {/* Search Icon */}
              <div className="absolute left-4 pointer-events-none">
                <svg 
                  className="w-5 h-5 text-gray-400 group-focus-within:text-sky-500 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
              
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter stock symbol (e.g. AAPL, GOOGL)" 
                className="w-full pl-12 pr-24 py-3 rounded-lg 
                  bg-black/60 border border-white/20 
                  text-white placeholder-gray-500 
                  focus:outline-none focus:border-sky-500 
                  focus:ring-2 focus:ring-sky-500/30
                  transition-all duration-300
                  group-hover:border-white/40
                  text-sm"
              />
              
              {/* Predict Button with Hover Effects */}
              <button 
                type="submit" 
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 
                  bg-sky-600 hover:bg-sky-700 
                  text-white rounded-lg 
                  px-5 py-2 
                  text-sm font-medium
                  transition-all duration-300
                  flex items-center
                  group
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:shadow-lg hover:shadow-sky-500/30
                  focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              >
                <span className="transition-transform group-hover:translate-x-1">
                  {loading ? 'Predicting...' : 'Predict'}
                </span>
                {!loading && (
                  <svg 
                    className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" 
                    />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Example Suggestions */}
            <div className="mt-2 flex justify-center space-x-2 text-xs">
              <span className="text-gray-500">Try:</span>
              {['AAPL', 'GOOGL', 'MSFT', 'AMZN'].map((symbol) => (
                <button 
                  key={symbol} 
                  type="button"
                  onClick={() => setSearchTerm(symbol)}
                  className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Error Handling with Detailed Explanation */}
        {error && (
          <div className="max-w-xl mx-auto mb-8 bg-red-900/20 border border-red-500/30 rounded-2xl p-6 text-red-400 space-y-4">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-semibold">{error}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-sky-400 font-bold mb-2">Troubleshooting Tips:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Verify the stock symbol (e.g., AAPL for Apple, GOOGL for Google)</li>
                <li>Check your internet connection</li>
                <li>Ensure the backend prediction server is running</li>
                <li>Try a different stock symbol</li>
              </ul>
            </div>
          </div>
        )}

        {renderCharts()}

        {/* Comprehensive Analysis Section */}
        {comprehensiveAnalysis && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6 mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-sky-500">
                Comprehensive Stock Analysis
              </h2>
              <div className="flex items-center space-x-2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm">Detailed Insights</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Company Info */}
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-sky-400 mb-4">Company Overview</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm block">Company Name</span>
                    <span className="text-white">{comprehensiveAnalysis.basic_info.company_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm block">Sector</span>
                    <span className="text-white">{comprehensiveAnalysis.basic_info.sector}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm block">Industry</span>
                    <span className="text-white">{comprehensiveAnalysis.basic_info.industry}</span>
                  </div>
                </div>
              </div>

              {/* Price Metrics */}
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-sky-400 mb-4">Price Metrics</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm block">Current Price</span>
                    <span className="text-white">${comprehensiveAnalysis.price_metrics.current_price.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm block">52-Week High</span>
                    <span className="text-green-500">${comprehensiveAnalysis.price_metrics.fifty_two_week_high.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm block">52-Week Low</span>
                    <span className="text-red-500">${comprehensiveAnalysis.price_metrics.fifty_two_week_low.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Financial Health */}
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-sky-400 mb-4">Financial Health</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm block">Market Cap</span>
                    <span className="text-white">${(comprehensiveAnalysis.financial_health.market_cap / 1000000000).toFixed(2)}B</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm block">P/E Ratio</span>
                    <span className="text-white">{comprehensiveAnalysis.financial_health.pe_ratio.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm block">Dividend Yield</span>
                    <span className="text-white">{(comprehensiveAnalysis.financial_health.dividend_yield * 100).toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm block">Beta</span>
                    <span className="text-white">{comprehensiveAnalysis.financial_health.beta.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance and Risk Analysis */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* Performance Analysis */}
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-sky-400 mb-4">Performance Analysis</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm block">Volatility</span>
                    <span className={`
                      ${comprehensiveAnalysis.risk_assessment.volatility_category === 'Low' ? 'text-green-500' : 
                        comprehensiveAnalysis.risk_assessment.volatility_category === 'Moderate' ? 'text-yellow-500' : 'text-red-500'}
                    `}>
                      {comprehensiveAnalysis.performance_analysis.volatility.toFixed(2)}% ({comprehensiveAnalysis.risk_assessment.volatility_category})
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm block">Sharpe Ratio</span>
                    <span className="text-white">{comprehensiveAnalysis.performance_analysis.sharpe_ratio.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm block">Monthly Returns</span>
                    <div className="max-h-32 overflow-y-auto">
                      {comprehensiveAnalysis.performance_analysis.monthly_returns.map((monthReturn, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-400">{monthReturn.month}</span>
                          <span className={`
                            ${monthReturn.return >= 0 ? 'text-green-500' : 'text-red-500'}
                          `}>
                            {monthReturn.return}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Assessment and Analyst Recommendations */}
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-sky-400 mb-4">Risk & Recommendations</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm block">Investment Risk Level</span>
                    <span className={`
                      ${comprehensiveAnalysis.risk_assessment.investment_risk_level === 'Conservative' ? 'text-green-500' : 
                        comprehensiveAnalysis.risk_assessment.investment_risk_level === 'Moderate' ? 'text-yellow-500' : 'text-red-500'}
                    `}>
                      {comprehensiveAnalysis.risk_assessment.investment_risk_level}
                    </span>
                  </div>
                  
                  {comprehensiveAnalysis.analyst_recommendations && (
                    <div>
                      <span className="text-gray-400 text-sm block mb-2">Analyst Recommendations</span>
                      <div className="flex space-x-4">
                        <div className="text-center">
                          <span className="text-green-500 font-bold block">{comprehensiveAnalysis.analyst_recommendations.buy}</span>
                          <span className="text-xs text-gray-400">Buy</span>
                        </div>
                        <div className="text-center">
                          <span className="text-yellow-500 font-bold block">{comprehensiveAnalysis.analyst_recommendations.hold}</span>
                          <span className="text-xs text-gray-400">Hold</span>
                        </div>
                        <div className="text-center">
                          <span className="text-red-500 font-bold block">{comprehensiveAnalysis.analyst_recommendations.sell}</span>
                          <span className="text-xs text-gray-400">Sell</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Add View All Market Trends button */}
                  <div className="mt-6">
                    <Link href="/market-trends" className="block w-full bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-md text-center transition-colors">
                      View All Market Trends
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
