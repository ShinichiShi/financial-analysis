'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <nav className="bg-black border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-sky-400">FinStock</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/predict" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Predict
              </Link>
              <Link href="/about" className="text-white bg-sky-600 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-sky-400">
          About FinStock
        </h1>
        <div className="prose prose-lg prose-invert max-w-none">
          <p className="text-xl text-gray-300 mb-8">
            FinStock is a cutting-edge financial analysis platform designed to help investors make data-driven decisions through advanced predictive analytics and market insights.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-6 text-sky-400">Our Mission</h2>
          <p className="text-gray-300 mb-6">
            Our mission is to democratize financial analytics by providing sophisticated tools that were once only available to institutional investors. We believe that with the right data and insights, everyone can make smarter investment decisions.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-6 text-sky-400">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-white">Predictive Analytics</h3>
              <p className="text-gray-300">
                Our advanced algorithms analyze historical data and market trends to provide accurate stock price predictions and market movement forecasts.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-white">Comprehensive Analysis</h3>
              <p className="text-gray-300">
                Get detailed insights into company fundamentals, technical indicators, and market sentiment all in one place.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-white">Risk Assessment</h3>
              <p className="text-gray-300">
                Understand the potential risks associated with your investments through our sophisticated risk modeling tools.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-white">Market Trends</h3>
              <p className="text-gray-300">
                Stay ahead of market movements with our trend analysis and sector performance tracking.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mt-12 mb-6 text-sky-400">Our Technology</h2>
          <p className="text-gray-300 mb-6">
            FinStock leverages cutting-edge technologies including:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-8">
            <li>Machine Learning algorithms for predictive modeling</li>
            <li>Natural Language Processing for sentiment analysis</li>
            <li>Time Series Analysis for pattern recognition</li>
            <li>Cloud computing for real-time data processing</li>
            <li>Advanced visualization techniques for intuitive data representation</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-12 mb-6 text-sky-400">Get Started Today</h2>
          <p className="text-gray-300 mb-8">
            Whether you&apos;re a seasoned investor or just starting out, FinStock provides the tools you need to make informed investment decisions in today&apos;s complex financial markets.
          </p>
          
          <div className="mt-8 text-center">
            <Link href="/predict" className="inline-block rounded-lg px-8 py-4 bg-sky-600 text-white font-medium hover:bg-sky-700 text-lg">
              Try Our Prediction Tool
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>© 2024 FinStock. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 