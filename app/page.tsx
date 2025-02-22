'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from 'next/link';

export default function Home() {
  const mainRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Destroy existing ScrollTriggers before creating new ones
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      const initScrollTriggers = () => {
        // Destroy any existing context
        const ctx = gsap.context(() => {
          // Initial load animations
          gsap.from(".nav-content", {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
          });

          gsap.from(".hero-content", {
            y: 100,
            opacity: 0,
            duration: 1,
            delay: 0.2,
            ease: "power3.out"
          });

          gsap.from(".chart-preview", {
            y: 100,
            opacity: 0,
            duration: 1,
            delay: 0.4,
            ease: "power3.out"
          });

          // Scroll trigger animations for other sections
          gsap.from(".features-section", {
            scrollTrigger: {
              trigger: ".features-section",
              start: "top bottom",
              toggleActions: "play none none reverse",
              preventOverlaps: true,
              fastScrollEnd: true,
              immediateRender: false
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
          });

          gsap.from(".pricing-section", {
            scrollTrigger: {
              trigger: ".pricing-section",
              start: "top bottom",
              toggleActions: "play none none reverse",
              preventOverlaps: true,
              fastScrollEnd: true,
              immediateRender: false
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
          });

          gsap.from(".social-proof-section", {
            scrollTrigger: {
              trigger: ".social-proof-section",
              start: "top bottom",
              toggleActions: "play none none reverse",
              preventOverlaps: true,
              fastScrollEnd: true,
              immediateRender: false
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
          });

          gsap.from(".footer-content", {
            scrollTrigger: {
              trigger: ".footer-content",
              start: "top bottom",
              toggleActions: "play none none reverse",
              preventOverlaps: true,
              fastScrollEnd: true,
              immediateRender: false
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
          });
        }, mainRef);

        return () => {
          // Properly clean up animations and ScrollTriggers
          ctx.revert();
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
      };

      // Initialize after a short delay to ensure DOM is ready
      const timer = setTimeout(initScrollTriggers, 100);

      // Cleanup function
      return () => {
        clearTimeout(timer);
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div ref={mainRef} className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="nav-content flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-sky-500">
                <span className="text-white">Fin</span>Stock
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#market-trends" className="text-gray-400 hover:text-white transition-colors">Market Trends</a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
              <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <button className="hidden md:block px-4 py-2 text-gray-400 hover:text-white transition-colors border border-gray-700 rounded-lg hover:border-sky-500">
                Log in
              </button>
              <Link 
                href="/predict" 
                className="rounded-lg px-8 py-4 bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors text-lg flex items-center group"
              >
                <span>Start Predicting</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Add margin-top to account for fixed navbar */}
      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center" data-scroll data-scroll-section data-scroll-speed="0.3">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-sky-950/20" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          
          <div className="relative w-full">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="hero-content text-left space-y-8">
                  <div className="inline-flex items-center px-4 py-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    New: Real-time Market Analysis
                  </div>
                  
                  <h1 className="text-5xl tracking-tight font-extrabold text-white sm:text-6xl md:text-7xl">
                    <span className="block">Predict Stock Markets</span>
                    <span className="block text-sky-500 mt-2">With AI Precision</span>
                  </h1>
                  
                  <p className="mt-6 text-lg text-gray-400 sm:text-xl md:text-2xl max-w-3xl leading-relaxed">
                    Advanced AI-powered stock predictions and market analysis. 
                    Get real-time insights, trend analysis, and smart investment recommendations.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <Link 
                      href="/predict" 
                      className="rounded-lg px-8 py-4 bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors text-lg flex items-center group"
                    >
                      <span>Start Predicting</span>
                      <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                    <button className="rounded-lg px-8 py-4 bg-white/10 text-white font-medium hover:bg-white/20 transition-colors text-lg border border-white/20 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Watch Demo
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                    <div>
                      <div className="text-2xl font-bold text-white">93%</div>
                      <div className="text-gray-400">Prediction Accuracy</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">24/7</div>
                      <div className="text-gray-400">Market Monitoring</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">50K+</div>
                      <div className="text-gray-400">Active Traders</div>
                    </div>
                  </div>
                </div>
                
                {/* Chart Preview */}
                <div className="chart-preview relative lg:-mr-8 xl:-mr-16">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/40 backdrop-blur-xl p-6 border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-500/10 to-transparent" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white">Market Overview</h3>
                          <p className="text-gray-400">Real-time market data</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                          </button>
                          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Stock Chart Preview */}
                      <div className="w-full h-[400px] bg-gradient-to-r from-sky-500/5 to-blue-500/5 rounded-xl flex items-center justify-center border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0">
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,50 Q25,40 50,60 T100,50" className="stroke-sky-500/50 stroke-2 fill-none" />
                            <path d="M0,50 Q25,45 50,65 T100,50" className="stroke-blue-500/30 stroke-2 fill-none" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-sky-500 mb-3">Live Market Predictions</div>
                          <div className="text-gray-400 text-lg">AI-powered analysis and forecasting</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-sm text-gray-400">Market Cap</div>
                          <div className="text-lg font-semibold text-white">$2.4T</div>
                          <div className="text-sky-500 text-sm flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            +2.4%
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-sm text-gray-400">24h Volume</div>
                          <div className="text-lg font-semibold text-white">$86.2B</div>
                          <div className="text-sky-500 text-sm flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            +5.1%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Trends Section */}
        <div id="market-trends" className="relative py-24 bg-gradient-to-b from-black to-sky-950/20" data-scroll data-scroll-section data-scroll-speed="0.2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 mb-4">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Live Market Updates
              </div>
              <h2 className="text-4xl font-bold text-white sm:text-5xl">
                Market Trends
                <span className="block text-sky-500 mt-2">Real-time Insights</span>
              </h2>
              <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
                Stay ahead of the market with our advanced trend analysis and predictions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Enhanced Trend Cards */}
              <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-sky-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-sky-500 transition-colors">NASDAQ</h3>
                      <p className="text-gray-400">Technology Sector</p>
                    </div>
                  </div>
                  <div className="text-sky-500 font-semibold">+2.4%</div>
                </div>
                <div className="h-32 bg-gradient-to-r from-sky-500/5 to-blue-500/5 rounded-lg mb-4 relative overflow-hidden group-hover:from-sky-500/10 group-hover:to-blue-500/10 transition-colors duration-300">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,50 Q25,40 50,60 T100,50" className="stroke-sky-500/50 stroke-2 fill-none" />
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">Volume</div>
                    <div className="text-white font-semibold">2.1B</div>
                    <div className="text-sky-500 text-sm flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      +5.2%
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">High</div>
                    <div className="text-white font-semibold">$15,243</div>
                    <div className="text-sky-500 text-sm flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      +3.8%
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-sky-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-500 transition-colors">S&P 500</h3>
                      <p className="text-gray-400">Market Index</p>
                    </div>
                  </div>
                  <div className="text-blue-500 font-semibold">+1.8%</div>
                </div>
                <div className="h-32 bg-gradient-to-r from-blue-500/5 to-sky-500/5 rounded-lg mb-4 relative overflow-hidden group-hover:from-blue-500/10 group-hover:to-sky-500/10 transition-colors duration-300">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,50 Q25,45 50,55 T100,50" className="stroke-blue-500/50 stroke-2 fill-none" />
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">Volume</div>
                    <div className="text-white font-semibold">1.8B</div>
                    <div className="text-blue-500 text-sm flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      +4.2%
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">High</div>
                    <div className="text-white font-semibold">$4,782</div>
                    <div className="text-blue-500 text-sm flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      +2.9%
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-sky-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-sky-500 transition-colors">Dow Jones</h3>
                      <p className="text-gray-400">Industrial Average</p>
                    </div>
                  </div>
                  <div className="text-sky-500 font-semibold">+1.2%</div>
                </div>
                <div className="h-32 bg-gradient-to-r from-sky-500/5 to-blue-500/5 rounded-lg mb-4 relative overflow-hidden group-hover:from-sky-500/10 group-hover:to-blue-500/10 transition-colors duration-300">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,50 Q25,48 50,52 T100,50" className="stroke-sky-500/50 stroke-2 fill-none" />
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">Volume</div>
                    <div className="text-white font-semibold">892M</div>
                    <div className="text-sky-500 text-sm flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      +3.1%
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">High</div>
                    <div className="text-white font-semibold">$36,513</div>
                    <div className="text-sky-500 text-sm flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      +2.5%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button className="rounded-lg px-8 py-4 bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors inline-flex items-center group">
                <span>View All Market Trends</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="features-section relative bg-gradient-to-b from-black to-black py-24" data-scroll data-scroll-section data-scroll-speed="0.2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 mb-4">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Advanced Trading Tools
              </div>
              <h2 className="text-4xl font-bold text-white sm:text-5xl">
                Powerful Features for
                <span className="block text-sky-500">Smart Trading</span>
              </h2>
              <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
                Discover our comprehensive suite of AI-powered tools designed to give you the edge in stock market trading.
              </p>
            </div>

            {/* Features Grid */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* AI Predictions */}
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-sky-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-sky-500/10">
                <div className="w-14 h-14 bg-sky-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-sky-500 transition-colors">AI Market Predictions</h3>
                <p className="text-gray-300">Advanced algorithms analyze market patterns and predict trends with high accuracy.</p>
                <ul className="mt-6 space-y-3 text-gray-400">
                  <li className="flex items-center group-hover:text-sky-300 transition-colors">
                    <svg className="w-5 h-5 text-sky-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Pattern Recognition
                  </li>
                  <li className="flex items-center group-hover:text-sky-300 transition-colors">
                    <svg className="w-5 h-5 text-sky-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Trend Analysis
                  </li>
                  <li className="flex items-center group-hover:text-sky-300 transition-colors">
                    <svg className="w-5 h-5 text-sky-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Price Forecasting
                  </li>
                </ul>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Accuracy Rate</span>
                    <span className="text-sky-500 font-semibold">93%</span>
                  </div>
                  <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: '93%' }}></div>
                  </div>
                </div>
              </div>

              {/* Real-time Analytics */}
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-sky-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-sky-500/10">
                <div className="w-14 h-14 bg-sky-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-sky-500 transition-colors">Real-time Analytics</h3>
                <p className="text-gray-300">Monitor market movements and get instant insights for informed decision-making.</p>
                <ul className="mt-6 space-y-3 text-gray-400">
                  <li className="flex items-center group-hover:text-sky-300 transition-colors">
                    <svg className="w-5 h-5 text-sky-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Live Market Data
                  </li>
                  <li className="flex items-center group-hover:text-sky-300 transition-colors">
                    <svg className="w-5 h-5 text-sky-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Performance Metrics
                  </li>
                  <li className="flex items-center group-hover:text-sky-300 transition-colors">
                    <svg className="w-5 h-5 text-sky-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Custom Dashboards
                  </li>
                </ul>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Data Freshness</span>
                    <span className="text-sky-500 font-semibold">Real-time</span>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                    <span className="text-sky-500 text-sm">Live Updates</span>
                  </div>
                </div>
              </div>

              {/* Portfolio Management */}
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-sky-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-sky-500/10">
                <div className="w-14 h-14 bg-sky-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-sky-500 transition-colors">Portfolio Management</h3>
                <p className="text-gray-300">Comprehensive tools for managing and optimizing your investment portfolio.</p>
                <ul className="mt-6 space-y-3 text-gray-400">
                  <li className="flex items-center group-hover:text-sky-300 transition-colors">
                    <svg className="w-5 h-5 text-sky-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Risk Analysis
                  </li>
                  <li className="flex items-center group-hover:text-sky-300 transition-colors">
                    <svg className="w-5 h-5 text-sky-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Asset Allocation
                  </li>
                  <li className="flex items-center group-hover:text-sky-300 transition-colors">
                    <svg className="w-5 h-5 text-sky-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Performance Tracking
                  </li>
                </ul>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Portfolio Growth</span>
                    <span className="text-sky-500 font-semibold">+24.6%</span>
                  </div>
                  <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: '24.6%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* View All Features Button */}
            <div className="mt-16 text-center">
              <button className="rounded-lg px-8 py-4 bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors inline-flex items-center group">
                <span>Explore All Features</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="pricing-section bg-black py-24" data-scroll data-scroll-section data-scroll-speed="0.2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Simple, Transparent Pricing</h2>
              <p className="mt-4 text-lg text-gray-400">
                Choose the perfect plan for your trading needs
              </p>
              <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Free Plan */}
                <div className="bg-black rounded-2xl shadow-lg p-8 border border-white/10">
                  <h3 className="text-xl font-semibold text-white">Basic</h3>
                  <p className="mt-4 text-gray-300">Perfect for getting started</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-white">Free</span>
                  </div>
                  <ul className="mt-8 space-y-4 text-gray-300">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Basic market predictions
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Daily market updates
                    </li>
                  </ul>
                  <button className="mt-8 w-full rounded-lg px-4 py-2 border-2 border-sky-500 text-sky-400 font-medium hover:bg-sky-500 hover:text-white transition-colors">
                    Get Started
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-black rounded-2xl shadow-lg p-8 border-2 border-sky-500 relative">
                  <div className="absolute -top-4 right-4 bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-medium">Popular</div>
                  <h3 className="text-xl font-semibold text-white">Pro</h3>
                  <p className="mt-4 text-gray-300">For serious traders</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-white">$49</span>
                    <span className="text-gray-300">/month</span>
                  </div>
                  <ul className="mt-8 space-y-4 text-gray-300">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Advanced AI predictions
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Real-time alerts
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Portfolio tracking
                    </li>
                  </ul>
                  <button className="mt-8 w-full rounded-lg px-4 py-2 bg-sky-500 text-white font-medium hover:bg-sky-600 transition-colors">
                    Start Pro Trial
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-black rounded-2xl shadow-lg p-8 border border-white/10">
                  <h3 className="text-xl font-semibold text-white">Enterprise</h3>
                  <p className="mt-4 text-gray-300">For institutions</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-white">$199</span>
                    <span className="text-gray-300">/month</span>
                  </div>
                  <ul className="mt-8 space-y-4 text-gray-300">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Custom AI models
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      API access
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Dedicated support
                    </li>
                  </ul>
                  <button className="mt-8 w-full rounded-lg px-4 py-2 border-2 border-sky-500 text-sky-400 font-medium hover:bg-sky-500 hover:text-white transition-colors">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="social-proof-section bg-background py-24" data-scroll data-scroll-section data-scroll-speed="0.2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Trusted by Professional Traders</h2>
              <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-4xl font-bold text-sky-600">93%</div>
                  <div className="text-gray-500">Prediction Accuracy</div>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-4xl font-bold text-sky-600">50K+</div>
                  <div className="text-gray-500">Active Traders</div>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-4xl font-bold text-sky-600">24/7</div>
                  <div className="text-gray-500">Market Monitoring</div>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-4xl font-bold text-sky-600">$2B+</div>
                  <div className="text-gray-500">Trading Volume</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="relative bg-gradient-to-b from-black to-sky-950/20 text-white" data-scroll data-scroll-section>
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5"></div>
          
          {/* Newsletter Section */}
          <div className="relative border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-4">Stay ahead of the market</h3>
                  <p className="text-gray-400 text-lg">Get the latest market insights and trading strategies delivered to your inbox.</p>
                </div>
                <div className="flex space-x-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                  <button className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-6 py-3 font-medium transition-colors flex items-center">
                    Subscribe
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
              {/* Company Info */}
              <div className="col-span-2 space-y-8">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-sky-500">
                    <span className="text-white">Fin</span>Stock
                  </span>
                </div>
                <p className="text-gray-400 max-w-md">
                  Advanced AI-powered stock predictions and market analysis platform. Make smarter trading decisions with real-time insights.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 2.063-1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">GitHub</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Product</h4>
                <ul className="space-y-3">
                  <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#market-trends" className="text-gray-400 hover:text-white transition-colors">Market Trends</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Status</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-gray-400 text-sm">
                  © 2024 FinStock. All rights reserved.
                </div>
                <div className="flex space-x-6 text-sm">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
