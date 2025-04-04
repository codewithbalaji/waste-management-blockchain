"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-200 to-green-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Blockchain-Powered Waste Management
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Combating illegal waste dumping through decentralized reporting, AI verification, and transparent accountability.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href="/report" className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                Report Dumping
              </Link>
              <a href="#learn-more" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <div className="relative mx-auto h-80 w-80 text-center sm:h-96 sm:w-96 lg:mx-0">
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 shadow-lg">
                <svg className="h-24 w-24 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 3v1H4v2h1v13a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-5V3H9zm0 5h2v9H9V8zm4 0h2v9h-2V8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div id="learn-more" className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {['about', 'features', 'technology', 'benefits'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium 
                  ${activeTab === tab 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* About Section */}
        {activeTab === 'about' && (
          <div className="prose prose-lg mx-auto">
            <h2>About The Project</h2>
            <p>
              Improper waste disposal in public spaces and unused lands is a critical societal and environmental issue. 
              This project proposes a decentralized solution leveraging blockchain technology for transparent tracking 
              and AI-powered image recognition to detect illegal waste dumping.
            </p>
            <p>
              The system incentivizes citizens to report violations through a token-based reward mechanism, 
              while municipal authorities can monitor and address violations efficiently. By combining 
              AI for real-time detection and blockchain for immutable accountability, the project aims 
              to reduce environmental pollution and promote civic responsibility.
            </p>
            <div className="mt-10 border-t border-gray-200 pt-10">
              <blockquote className="italic text-gray-700">
                &ldquo;Combating waste pollution requires collective effort and accountability. Our blockchain 
                solution brings transparency and incentives to this critical environmental challenge.&rdquo;
              </blockquote>
            </div>
          </div>
        )}

        {/* Features Section */}
        {activeTab === 'features' && (
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-16">
              Key Features
            </h2>
            <div className="grid grid-cols-1 gap-y-16 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Decentralized Reporting',
                  description: 'Citizens can easily report illegal dumping with photo evidence, location data, and descriptions.',
                  icon: (
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                },
                {
                  title: 'AI Image Verification',
                  description: 'Advanced AI algorithms verify submitted photos to confirm illegal dumping before recording reports.',
                  icon: (
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  )
                },
                {
                  title: 'Blockchain Transparency',
                  description: 'All verified reports are immutably stored on the blockchain, ensuring accountability and preventing fraud.',
                  icon: (
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )
                },
                {
                  title: 'Token Incentives',
                  description: 'Reporters receive token rewards for validated submissions, creating economic incentives for public participation.',
                  icon: (
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: 'Municipal Dashboard',
                  description: 'Authorities can track, prioritize, and manage cleanup efforts based on blockchain data.',
                  icon: (
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  title: 'Data Analytics',
                  description: 'Comprehensive waste dumping patterns analysis for better policy decisions and resource allocation.',
                  icon: (
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <div key={index} className="relative flex flex-col gap-6 sm:flex-row md:flex-col lg:flex-row">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700 sm:shrink-0">
                    {feature.icon}
                  </div>
                  <div className="sm:min-w-0 sm:flex-1">
                    <h3 className="text-lg font-semibold leading-8 text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-base leading-7 text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technology Section */}
        {activeTab === 'technology' && (
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-16">
              Our Technology Stack
            </h2>
            <div className="grid grid-cols-1 gap-y-12 gap-x-6 lg:grid-cols-2">
              {[
                {
                  title: 'Blockchain Infrastructure',
                  description: 'Built on Ethereum for secure, transparent, and immutable record-keeping of all waste dumping reports and cleanup activities.',
                  items: ['Smart Contracts', 'ERC-20 Tokens', 'Decentralized Storage', 'Transparent Ledger']
                },
                {
                  title: 'AI and Image Recognition',
                  description: 'Leverages Google\'s Gemini AI to verify submitted photos and determine if they actually show illegal dumping with high confidence.',
                  items: ['Computer Vision', 'Machine Learning', 'Auto Classification', 'Fraud Prevention']
                },
                {
                  title: 'Mobile & Web Applications',
                  description: 'User-friendly interfaces for citizens to report illegal dumping and for authorities to manage cleanup efforts.',
                  items: ['React & Next.js', 'Progressive Web App', 'Geolocation', 'Mobile Camera Integration']
                },
                {
                  title: 'Data & Analytics',
                  description: 'Comprehensive waste data collection and analysis to identify patterns and optimize waste management strategies.',
                  items: ['Real-time Reporting', 'Geographic Clustering', 'Trend Analysis', 'Predictive Modeling']
                }
              ].map((tech, index) => (
                <div key={index} className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">{tech.title}</h3>
                  <p className="mt-2 text-base leading-7 text-gray-600">{tech.description}</p>
                  <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2">
                    {tech.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex gap-x-3">
                        <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm leading-6 text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits Section */}
        {activeTab === 'benefits' && (
          <div className="prose prose-lg mx-auto">
            <h2>Environmental & Social Impact</h2>
            
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="relative rounded-lg bg-green-50 p-6">
                <h3 className="text-xl font-semibold text-green-800">Environmental Benefits</h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex gap-x-3 text-gray-700">
                    <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Reduced soil and water contamination from improper waste disposal
                  </li>
                  <li className="flex gap-x-3 text-gray-700">
                    <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Preservation of natural habitats and ecosystems
                  </li>
                  <li className="flex gap-x-3 text-gray-700">
                    <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Decreased greenhouse gas emissions from decomposing waste
                  </li>
                  <li className="flex gap-x-3 text-gray-700">
                    <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Improved recycling rates through better waste management
                  </li>
                </ul>
              </div>
              
              <div className="relative rounded-lg bg-blue-50 p-6">
                <h3 className="text-xl font-semibold text-blue-800">Social & Economic Benefits</h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex gap-x-3 text-gray-700">
                    <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Enhanced community health through cleaner public spaces
                  </li>
                  <li className="flex gap-x-3 text-gray-700">
                    <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Economic incentives for environmental stewardship
                  </li>
                  <li className="flex gap-x-3 text-gray-700">
                    <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Reduced municipal cleanup costs through prevention
                  </li>
                  <li className="flex gap-x-3 text-gray-700">
                    <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Increased civic engagement and community pride
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900">Join Our Mission</h3>
              <p className="mt-4">
                Be part of the solution by reporting illegal dumping in your community. 
                Together, we can create cleaner, healthier environments for everyone.
              </p>
              <div className="mt-6">
                <Link href="/report" className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                  Start Reporting Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-sm leading-5 text-gray-500">
              &copy; {new Date().getFullYear()} Waste Management Blockchain. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
