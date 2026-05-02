'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Premium() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: ['5 Guest Conversions', '20 Conversions after Login', 'Standard Speed', 'Basic Tools'],
      button: 'Current Plan',
      color: 'bg-gray-100 text-gray-900',
      active: true
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: '/mo',
      features: ['Unlimited Conversions', 'Highest Speed', 'Priority AI Models', 'Ad-Free Experience', 'Bulk Link Dumper'],
      button: 'Go Premium',
      color: 'bg-red-600 text-white shadow-xl',
      popular: true
    },
    {
      name: 'Business',
      price: '$29.99',
      period: '/mo',
      features: ['Everything in Premium', 'API Access', 'Team Management', 'Custom Branding', '24/7 Support'],
      button: 'Contact Sales',
      color: 'bg-gray-900 text-white'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Choose Your Power</h1>
        <p className="text-xl text-gray-500 mb-16 max-w-2xl mx-auto font-medium italic">Unlock the full potential of ToolsX. Professional tools for professional results.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative p-10 rounded-[3rem] border border-gray-100 bg-white flex flex-col ${plan.popular ? 'scale-105 z-10' : ''}`}>
              {plan.popular && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-purple-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-lg">Most Popular</span>
              )}
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">{plan.name}</h2>
              <div className="flex items-baseline justify-center gap-1 mb-8">
                <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-400 font-bold uppercase text-xs">{plan.period}</span>}
              </div>
              
              <ul className="space-y-4 mb-12 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-bold text-gray-600 uppercase">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 ${plan.color}`}>
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
