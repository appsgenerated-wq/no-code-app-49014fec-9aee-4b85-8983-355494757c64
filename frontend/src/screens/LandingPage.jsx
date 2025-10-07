import React from 'react';
import config from '../constants.js';
import { ShieldCheckIcon, SparklesIcon, UsersIcon } from '@heroicons/react/24/outline';

const LandingPage = ({ onLogin }) => {
  const features = [
    { name: 'Log Cheeses', description: 'Keep a digital record of every cheese you discover.', icon: SparklesIcon },
    { name: 'Rate & Review', description: 'Share your expert opinion on aroma, texture, and taste.', icon: UsersIcon },
    { name: 'Secure Pantry', description: 'All your cheese findings are stored securely.', icon: ShieldCheckIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 text-lg font-bold text-gray-900">
              Mice's Cheese Pantry
            </a>
          </div>
          <div className="lg:flex lg:flex-1 lg:justify-end">
             <button onClick={() => onLogin('forager@demo.com', 'password')} className="text-sm font-semibold leading-6 text-gray-900">Log in <span aria-hidden="true">&rarr;</span></button>
          </div>
        </nav>
      </header>

      <main className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">The Ultimate Cheese Catalog for the Modern Mouse</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">From pungent blues to creamy bries, never forget a cheese again. Catalog, rate, and share your delightful dairy discoveries.</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => onLogin('forager@demo.com', 'password')}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login as Demo Forager
              </button>
              <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold leading-6 text-gray-900">Admin Panel <span aria-hidden="true">&rarr;</span></a>
            </div>
          </div>
        </div>
      </main>

       <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">For Connoisseurs</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything a mouse needs</p>
            <p className="mt-6 text-lg leading-8 text-gray-600">Our platform provides all the tools for serious cheese logging and analysis.</p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
