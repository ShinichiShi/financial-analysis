'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const mainRef = useRef(null);
  // Add a state to track if component is mounted
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted to avoid hydration mismatch
    setIsMounted(true);
    
    // Only run GSAP on the client side after component is mounted
    if (typeof window !== 'undefined') {
      // Small timeout to ensure DOM is fully ready
      const timer = setTimeout(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        // Clean up any existing scroll triggers
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        
        const ctx = gsap.context(() => {
          // Enhanced Parallax Background Effect
          gsap.to(".parallax-bg", {
            scrollTrigger: {
              trigger: ".hero-section",
              start: "top top",
              end: "bottom top",
              scrub: true
            },
            y: 100,
            ease: "none"
          });
          
          // Floating Elements Animation
          const floatingElements = document.querySelectorAll('.floating-element');
          floatingElements.forEach((element, index) => {
            gsap.to(element, {
              y: "random(-20, 20)",
              x: "random(-20, 20)",
              rotation: "random(-10, 10)",
              duration: "random(2, 4)",
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: index * 0.2
            });
          });

          // Enhanced Navigation Animation
          gsap.from(".nav-content > *", {
            y: -50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
          });

          // Enhanced Hero Content Animation
          gsap.from(".hero-content > *", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.3,
            ease: "power3.out"
          });

          // Chart Preview Animation with 3D Effect
          gsap.from(".chart-preview", {
            scale: 0.9,
            y: 100,
            rotationY: 15,
            opacity: 0,
            duration: 1.2,
            delay: 0.6,
            ease: "power3.out"
          });

          // Scroll-triggered Animations for Sections
          const sections = [".features-section", ".market-trends-section", ".pricing-section", ".social-proof-section"];
          sections.forEach(section => {
            gsap.from(`${section} > *`, {
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
              },
              y: 50,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out"
            });
          });

          // Card Hover Effects
          const cards = document.querySelectorAll('.hover-card');
          cards.forEach(card => {
            (card as HTMLElement).addEventListener('mousemove', (e: Event) => {
              const mouseEvent = e as MouseEvent;
              const rect = (card as HTMLElement).getBoundingClientRect();
              const x = mouseEvent.clientX - rect.left;
              const y = mouseEvent.clientY - rect.top;
              
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              
              const rotateX = (y - centerY) / 20;
              const rotateY = (centerX - x) / 20;
              
              gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                scale: 1.02,
                duration: 0.5,
                ease: "power2.out"
              });
            });
            
            (card as HTMLElement).addEventListener('mouseleave', () => {
              gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.5,
                ease: "power2.out"
              });
            });
          });
        }, mainRef);
        
        return () => ctx.revert();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  return (
    <div ref={mainRef} className="min-h-screen bg-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-sky-950/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        {/* Floating Elements */}
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="floating-element absolute w-2 h-2 bg-sky-500/20 rounded-full"
                style={{
                  left: `${i * 5}%`,
                  top: `${(i * 7) % 100}%`,
                  animationDelay: `${i * 0.25}s`
                }}
              />
            ))}
          </div>
        )}
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/30 rounded-full filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Enhanced Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="nav-content flex items-center justify-between h-20">
            {/* Enhanced Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-sky-500 relative group cursor-pointer">
                <span className="text-white group-hover:text-sky-400 transition-colors duration-300">Fin</span>
                <span className="group-hover:text-white transition-colors duration-300">Stock</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </span>
            </div>

            {/* Enhanced Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Market Trends', 'Pricing'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-400 hover:text-white transition-colors relative group py-2"
                >
                  <span className="relative z-10">{item}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500/0 to-blue-500/0 group-hover:from-sky-500/5 group-hover:to-blue-500/5 transition-all duration-300 rounded-lg -z-10"></span>
                </a>
              ))}
              <Link
                href="/about"
                className="text-gray-400 hover:text-white transition-colors relative group py-2"
              >
                <span className="relative z-10">About</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500/0 to-blue-500/0 group-hover:from-sky-500/5 group-hover:to-blue-500/5 transition-all duration-300 rounded-lg -z-10"></span>
              </Link>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex items-center space-x-4">
              {/* Login button removed */}
              <Link 
                href="/predict" 
                className="rounded-lg px-8 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-medium hover:from-sky-700 hover:to-blue-700 transition-all duration-300 text-lg flex items-center group relative overflow-hidden shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-400/20 to-blue-400/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                <span className="relative z-10">Try Analysis</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <div className="md:hidden">
              <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 relative group">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500/10 to-blue-500/10 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-lg"></span>
                <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20">
        {/* Enhanced Hero Section */}
        <div className="hero-section relative overflow-hidden min-h-[calc(100vh-5rem)] flex items-center">
          {/* Parallax Background */}
          <div className="parallax-bg absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-sky-950/20" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent" />
          </div>
          
          <div className="relative w-full">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Enhanced Hero Content */}
                <div className="hero-content text-left space-y-8">
                  <div className="inline-flex items-center px-4 py-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 backdrop-blur-sm hover:bg-sky-500/20 transition-colors cursor-pointer group relative overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500/20 to-blue-500/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                    <svg className="w-4 h-4 mr-2 relative z-10 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="relative z-10">New: Real-time Market Analysis</span>
                  </div>
                  
                  <h1 className="text-5xl tracking-tight font-extrabold sm:text-6xl md:text-7xl">
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80">
                      Predict Stock Markets
                    </span>
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 mt-2">
                      With AI Precision
                    </span>
                  </h1>
                  
                  <p className="mt-6 text-xl text-gray-400 sm:text-2xl max-w-3xl leading-relaxed">
                    Harness the power of advanced AI for precise stock predictions and comprehensive market analysis. 
                    Get real-time insights, trend analysis, and smart investment recommendations tailored to your portfolio.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <Link 
                      href="/predict" 
                      className="rounded-lg px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-medium hover:from-sky-700 hover:to-blue-700 transition-all duration-300 text-lg flex items-center group relative overflow-hidden shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transform hover:-translate-y-1"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                      <span className="relative z-10">Try Analysis</span>
                      <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                  
                  {/* Enhanced Stats Section */}
                  <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                    {[
                      { value: '93%', label: 'Prediction Accuracy', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                      { value: '24/7', label: 'Market Monitoring', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                      { value: '50K+', label: 'Active Traders', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
                    ].map((stat, index) => (
                      <div key={index} className="group cursor-pointer hover-card transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                            </svg>
                          </div>
                          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-sky-400 group-hover:to-sky-500 transition-colors">
                            {stat.value}
                          </div>
                        </div>
                        <div className="text-gray-400 group-hover:text-sky-400 transition-colors pl-11">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Enhanced Chart Preview */}
                <div className="chart-preview relative lg:-mr-8 xl:-mr-16 hover-card perspective-1000">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/40 backdrop-blur-xl p-8 border border-white/10 hover:border-sky-500/50 transition-all duration-300 group transform hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-blue-500/5 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-xl font-semibold text-white group-hover:text-sky-400 transition-colors">Market Overview</h3>
                          <p className="text-gray-400">Real-time market data</p>
                        </div>
                        <div className="flex space-x-3">
                          {['1D', '1W', '1M', '1Y'].map((period) => (
                            <button 
                              key={period}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-sky-500/20 transition-colors text-sm text-gray-400 hover:text-white relative group overflow-hidden"
                            >
                              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500/20 to-blue-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                              <span className="relative z-10">{period}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Enhanced Chart Component */}
                      <div className="h-64 bg-gradient-to-r from-sky-500/5 to-blue-500/5 rounded-lg relative overflow-hidden group-hover:from-sky-500/10 group-hover:to-blue-500/10 transition-colors duration-300">
                        {/* Price Indicators */}
                        <div className="absolute left-2 top-2 bottom-2 flex flex-col justify-between text-xs text-gray-400">
                          <span>$45.2K</span>
                          <span>$44.8K</span>
                          <span>$44.4K</span>
                          <span>$44.0K</span>
                          <span>$43.6K</span>
                        </div>

                        {/* Time Indicators */}
                        <div className="absolute left-12 right-2 bottom-2 flex justify-between text-xs text-gray-400">
                          <span>09:30</span>
                          <span>10:30</span>
                          <span>11:30</span>
                          <span>12:30</span>
                          <span>13:30</span>
                        </div>

                        {/* Grid Lines */}
                        <div className="absolute inset-0 grid grid-cols-4 gap-4">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="border-l border-white/5 h-full" />
                          ))}
                        </div>
                        <div className="absolute inset-0 grid grid-rows-4 gap-4">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="border-t border-white/5 w-full" />
                          ))}
                        </div>

                        {/* Market Indicators */}
                        <div className="absolute top-3 right-3 flex flex-col space-y-2">
                          <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs flex items-center">
                            <span className="w-1 h-1 bg-green-500 rounded-full mr-1"></span>
                            Buy Signal
                          </div>
                          <div className="bg-white/5 text-gray-400 px-2 py-1 rounded text-xs flex items-center">
                            <span className="w-1 h-1 bg-sky-500 rounded-full mr-1"></span>
                            Volume: 2.4M
                          </div>
                        </div>

                        {/* Data Points */}
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-2 h-2 bg-sky-500 rounded-full shadow-lg shadow-sky-500/50"
                              style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + Math.sin(i) * 20}%`,
                              }}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-sky-500/90 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                                $44,{750 + i * 100}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Existing Animated Lines */}
                        <div className="absolute inset-0">
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* Keep existing path animations unchanged */}
                            <path 
                              d="M-100,50 C-70,20 -30,80 0,50 C30,20 70,80 100,50 C130,20 170,80 200,50" 
                              className="stroke-sky-500/40 stroke-2 fill-none"
                              style={{
                                animation: 'moveLeft 15s linear infinite',
                              }}
                            />
                            <path 
                              d="M-100,50 C-70,70 -30,30 0,50 C30,70 70,30 100,50 C130,70 170,30 200,50" 
                              className="stroke-blue-500/30 stroke-2 fill-none"
                              style={{
                                animation: 'moveRight 12s linear infinite',
                              }}
                            />
                            <path 
                              d="M-100,50 C-70,10 -30,90 0,50 C30,10 70,90 100,50 C130,10 170,90 200,50" 
                              className="stroke-sky-400/20 stroke-2 fill-none"
                              style={{
                                animation: 'moveLeft 18s linear infinite',
                              }}
                            />
                            <path 
                              d="M-100,50 C-70,85 -30,15 0,50 C30,85 70,15 100,50 C130,85 170,15 200,50" 
                              className="stroke-white/10 stroke-2 fill-none"
                              style={{
                                animation: 'moveRight 20s linear infinite',
                              }}
                            />
                          </svg>
                        </div>

                        {/* Trend Indicators */}
                        <div className="absolute bottom-10 right-3 flex flex-col space-y-2">
                          <div className="bg-sky-500/20 text-sky-400 px-2 py-1 rounded text-xs flex items-center">
                            <span className="w-1 h-1 bg-sky-500 rounded-full mr-1"></span>
                            RSI: 65.4
                          </div>
                          <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs flex items-center">
                            <span className="w-1 h-1 bg-blue-500 rounded-full mr-1"></span>
                            MACD: +0.24
                          </div>
                        </div>
                        
                        <style jsx>{`
                          @keyframes moveLeft {
                            from {
                              transform: translateX(100%);
                            }
                            to {
                              transform: translateX(-100%);
                            }
                          }
                          @keyframes moveRight {
                            from {
                              transform: translateX(-100%);
                            }
                            to {
                              transform: translateX(100%);
                            }
                          }
                          @keyframes pulse {
                            0%, 100% {
                              opacity: 1;
                            }
                            50% {
                              opacity: 0.5;
                            }
                          }
                          .stroke-sky-500\/40 {
                            animation: pulse 4s ease-in-out infinite;
                          }
                          .stroke-blue-500\/30 {
                            animation: pulse 4s ease-in-out infinite 1s;
                          }
                          .stroke-sky-400\/20 {
                            animation: pulse 4s ease-in-out infinite 2s;
                          }
                        `}</style>
                      </div>
                      
                      {/* Enhanced Market Indicators */}
                      <div className="grid grid-cols-3 gap-6 mt-8">
                        {[
                          { label: 'Market Cap', value: '$2.4T', trend: '+2.4%' },
                          { label: 'Volume', value: '127.4M', trend: '+3.8%' },
                          { label: 'Volatility', value: 'Low', trend: '-1.2%' }
                        ].map((indicator, index) => (
                          <div key={index} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/10">
                            <div className="text-gray-400 text-sm">{indicator.label}</div>
                            <div className="text-white font-semibold mt-1">{indicator.value}</div>
                            <div className={`text-sm flex items-center mt-1 ${
                              indicator.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
                            }`}>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d={indicator.trend.startsWith('+') 
                                    ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                                    : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"} 
                                />
                              </svg>
                              {indicator.trend}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Points to Remember Section */}
        <div className="relative py-24 bg-gradient-to-b from-black to-sky-950/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 mb-4">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Important Guidelines
              </div>
              <h2 className="text-4xl font-bold text-white sm:text-5xl">
                Points to Remember
                <span className="block text-sky-500 mt-2">Before Making Predictions</span>
              </h2>
              <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
                Consider these crucial factors before making any stock market predictions or investment decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Market Research */}
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-sky-500/50 transition-all duration-300 group hover:transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-sky-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-sky-500">Market Research</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Study company fundamentals
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Analyze industry trends
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Review historical data
                  </li>
                </ul>
              </div>

              {/* Risk Assessment */}
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-sky-500/50 transition-all duration-300 group hover:transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-sky-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-sky-500">Risk Assessment</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Evaluate market volatility
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Consider global events
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Assess sector risks
                  </li>
                </ul>
              </div>

              {/* Technical Analysis */}
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-sky-500/50 transition-all duration-300 group hover:transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-sky-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-sky-500">Technical Analysis</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Check price patterns
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Monitor trading volume
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Use technical indicators
                  </li>
                </ul>
              </div>

              {/* Market Sentiment */}
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-sky-500/50 transition-all duration-300 group hover:transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-sky-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-sky-500">Market Sentiment</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Track market mood
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Monitor news impact
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Analyze social sentiment
                  </li>
                </ul>
              </div>

              {/* Portfolio Diversification */}
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-sky-500/50 transition-all duration-300 group hover:transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-sky-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-sky-500">Portfolio Diversification</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Spread investments
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Balance asset classes
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Consider correlation
                  </li>
                </ul>
              </div>

              {/* Time Horizon */}
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-sky-500/50 transition-all duration-300 group hover:transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-sky-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-sky-500">Time Horizon</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Define investment period
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Plan exit strategy
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Adjust for goals
                  </li>
                </ul>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-12 bg-sky-500/10 border border-sky-500/30 rounded-2xl p-6 text-center">
              <p className="text-gray-400">
                Remember: Past performance is not indicative of future results. Always conduct thorough research and consider consulting with a financial advisor before making investment decisions.
              </p>
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
              <Link href="/market-trends" className="rounded-lg px-8 py-4 bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors inline-flex items-center group">
                <span>View All Market Trends</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
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
              <Link 
                href="/predict" 
                className="rounded-lg px-8 py-4 bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors inline-flex items-center group"
              >
                <span>Try Feature</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="pricing-section relative py-24 bg-gradient-to-b from-black via-black/95 to-sky-950/20" data-scroll data-scroll-section data-scroll-speed="0.2">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 mb-4">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Flexible Pricing
              </div>
              <h2 className="text-4xl font-bold text-white sm:text-5xl mb-4">
                Choose Your Perfect Plan
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Select the plan that best fits your trading needs. All plans include our core features with additional perks as you scale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Basic Plan */}
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-sky-500/50 transition-all duration-300 group hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-white group-hover:text-sky-400 transition-colors">Basic</h3>
                    <p className="mt-2 text-gray-400">Perfect for getting started</p>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-white">Free</span>
                    <span className="ml-2 text-gray-400">/month</span>
                  </div>
                  <ul className="space-y-4 text-gray-400">
                    {[
                      'Basic market predictions',
                      'Daily market updates',
                      'Limited trend analysis',
                      'Email support',
                      'Mobile app access'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-sky-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full rounded-lg px-4 py-3 border-2 border-sky-500 text-sky-400 font-medium hover:bg-sky-500 hover:text-white transition-all duration-300 relative group overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10">Get Started Free</span>
                  </button>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border-2 border-sky-500 hover:border-sky-400 transition-all duration-300 group hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/20">
                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                  <div className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-white group-hover:text-sky-400 transition-colors">Pro</h3>
                    <p className="mt-2 text-gray-400">For serious traders</p>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">$49</span>
                    <span className="ml-2 text-gray-400">/month</span>
                  </div>
                  <ul className="space-y-4 text-gray-400">
                    {[
                      'Advanced AI predictions',
                      'Real-time market alerts',
                      'Full trend analysis',
                      'Portfolio tracking',
                      'Priority email support',
                      'Advanced mobile features'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-sky-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full rounded-lg px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-medium hover:from-sky-600 hover:to-blue-600 transition-all duration-300 transform group-hover:scale-[1.02] shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40">
                    Start Pro Trial
                  </button>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-sky-500/50 transition-all duration-300 group hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-white group-hover:text-sky-400 transition-colors">Enterprise</h3>
                    <p className="mt-2 text-gray-400">For institutions & teams</p>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-white">$199</span>
                    <span className="ml-2 text-gray-400">/month</span>
                  </div>
                  <ul className="space-y-4 text-gray-400">
                    {[
                      'Custom AI models',
                      'Unlimited predictions',
                      'Advanced analytics',
                      'Team collaboration',
                      'Dedicated account manager',
                      'Custom integrations',
                      'SLA & premium support'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-sky-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full rounded-lg px-4 py-3 border-2 border-sky-500 text-sky-400 font-medium hover:bg-sky-500 hover:text-white transition-all duration-300 relative group overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10">Contact Sales</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Features Section */}
            <div className="mt-24 text-center">
              <h3 className="text-2xl font-bold text-white mb-12">All Plans Include</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  {
                    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                    title: 'Secure Platform',
                    description: 'Bank-grade security'
                  },
                  {
                    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                    title: 'Real-time Data',
                    description: 'Live market updates'
                  },
                  {
                    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                    title: 'Market Analysis',
                    description: 'Detailed insights'
                  },
                  {
                    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
                    title: '24/7 Support',
                    description: 'Always here to help'
                  }
                ].map((feature, index) => (
                  <div key={index} className="group">
                    <div className="w-16 h-16 mx-auto bg-sky-500/10 rounded-2xl flex items-center justify-center group-hover:bg-sky-500/20 transition-colors duration-300">
                      <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                      </svg>
                    </div>
                    <h4 className="mt-4 text-lg font-semibold text-white group-hover:text-sky-400 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="mt-2 text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                ))}
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
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-3">
                  <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
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
