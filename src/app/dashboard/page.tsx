'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        setUserData(userDoc.data());
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="py-20 text-center uppercase font-black text-gray-400">Loading Dashboard...</div>;

  if (!user) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-black mb-4">PLEASE LOG IN</h1>
        <Link href="/login" className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg uppercase">Login Now</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 to-purple-600"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Welcome Back</p>
              <h1 className="text-4xl font-black text-gray-900 truncate max-w-md uppercase tracking-tighter">{user.email?.split('@')[0]}</h1>
            </div>
            <button 
              onClick={() => signOut(auth)}
              className="px-6 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-colors uppercase text-xs"
            >
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Usage Card */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="font-black text-gray-400 uppercase text-xs mb-4">Total Usage</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-gray-900">{userData?.conversionCount || 0}</span>
                <span className="text-gray-400 font-bold uppercase text-xs">/ {userData?.tier === 'unlimited' ? '∞' : '20'}</span>
              </div>
              <p className="text-sm text-gray-500 mt-4 font-medium">Monthly conversion limit.</p>
            </div>

            {/* Plan Card */}
            <div className={`rounded-2xl p-8 border ${userData?.tier === 'unlimited' ? 'bg-purple-50 border-purple-100' : 'bg-red-50 border-red-100'}`}>
              <h3 className={`font-black uppercase text-xs mb-4 ${userData?.tier === 'unlimited' ? 'text-purple-600' : 'text-red-600'}`}>Current Plan</h3>
              <span className={`text-4xl font-black uppercase tracking-tighter ${userData?.tier === 'unlimited' ? 'text-purple-900' : 'text-red-900'}`}>
                {userData?.tier || 'Free'}
              </span>
              <p className="text-sm text-gray-500 mt-4 font-medium">
                {userData?.tier === 'unlimited' ? 'Enjoy unlimited professional tools.' : 'Upgrade for more tools and power.'}
              </p>
            </div>

            {/* Premium Button Card */}
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-gray-400 uppercase text-xs mb-4">Unlock Everything</h3>
                <p className="text-white font-bold leading-tight uppercase tracking-tight">Go Premium for <span className="text-red-600 text-xl font-black">$9.99/mo</span></p>
              </div>
              <Link href="/premium" className="mt-6 w-full py-4 bg-red-600 text-white font-black rounded-xl text-center hover:bg-red-700 transition-colors uppercase tracking-widest text-xs">
                Upgrade Now
              </Link>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="mt-12 pt-12 border-t border-gray-100">
            <h3 className="font-black text-gray-900 uppercase text-sm mb-6">Have a coupon or gift code?</h3>
            <div className="flex gap-4 max-w-md">
              <input 
                type="text" 
                placeholder="XXXX-XXXX-XXXX"
                className="flex-grow p-4 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-red-50 uppercase font-mono font-bold"
              />
              <button className="px-8 py-4 bg-gray-900 text-white font-black rounded-xl uppercase tracking-widest text-xs hover:bg-black transition-colors">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
