// filepath: c:\Users\Alfred\Desktop\PhotographyNext\photography\src\app\components\Pricing.tsx
import React from 'react';

const Pricing = () => {
  return (
    <div className="py-10 px-5">
      <h2 className="text-3xl font-bold text-center mb-6">Pricing Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-5 shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Basic</h3>
          <p className="text-xl mb-4">$19/month</p>
          <ul className="list-disc list-inside mb-4">
            <li>Access to basic features</li>
            <li>10 GB storage</li>
            <li>Email support</li>
          </ul>
          <button className="bg-orange-600 text-white py-2 px-4 rounded">Choose Plan</button>
        </div>
        <div className="border rounded-lg p-5 shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Standard</h3>
          <p className="text-xl mb-4">$39/month</p>
          <ul className="list-disc list-inside mb-4">
            <li>Access to all features</li>
            <li>50 GB storage</li>
            <li>Priority support</li>
          </ul>
          <button className="bg-orange-600 text-white py-2 px-4 rounded">Choose Plan</button>
        </div>
        <div className="border rounded-lg p-5 shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Premium</h3>
          <p className="text-xl mb-4">$99/month</p>
          <ul className="list-disc list-inside mb-4">
            <li>All features included</li>
            <li>Unlimited storage</li>
            <li>24/7 support</li>
          </ul>
          <button className="bg-orange-600 text-white py-2 px-4 rounded">Choose Plan</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;