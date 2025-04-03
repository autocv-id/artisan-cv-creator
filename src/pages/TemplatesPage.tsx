import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { templates } from '../data/templates';
import { Template } from '../types/template';

// Simulasi status pengguna (dalam implementasi nyata, ini akan berasal dari sistem autentikasi)
const isPremiumUser = false;

const TemplatesPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');
  
  const filteredTemplates = templates.filter(template => {
    if (filter === 'all') return true;
    return template.category === filter;
  });

  const handleFilterChange = (newFilter: 'all' | 'free' | 'premium') => {
    setFilter(newFilter);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Resume Templates</h1>
      
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Templates
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange('free')}
            className={`px-4 py-2 text-sm font-medium ${
              filter === 'free' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Free
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange('premium')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              filter === 'premium' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Premium
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard 
            key={template.id} 
            template={template} 
            isPremiumUser={isPremiumUser} 
          />
        ))}
      </div>
      
      {!isPremiumUser && (
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Upgrade to Premium</h2>
          <p className="mb-4">Get access to all premium templates and exclusive features to create standout resumes.</p>
          <button 
            className="bg-white text-indigo-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
            onClick={() => alert('Upgrade functionality would go here')}
          >
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
};

interface TemplateCardProps {
  template: Template;
  isPremiumUser: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isPremiumUser }) => {
  const isPremium = template.category === 'premium';
  const isLocked = isPremium && !isPremiumUser;
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={template.thumbnail} 
          alt={template.name} 
          className={`w-full h-48 object-cover ${isLocked ? 'filter blur-sm' : ''}`}
          onError={(e) => {
            // Fallback image if template image fails to load
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Template';
          }}
        />
        
        {isPremium && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            PREMIUM
          </span>
        )}
        
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="text-white text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="font-medium">Premium Template</p>
              <p className="text-sm">Upgrade to access</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{template.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{template.description}</p>
        
        {isLocked ? (
          <button 
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
            onClick={() => alert('Please upgrade to premium to use this template')}
          >
            Unlock Template
          </button>
        ) : (
          <Link 
            to={`/editor/${template.id}`}
            className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Use This Template
          </Link>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;
